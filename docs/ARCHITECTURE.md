# System Architecture — Apio

> Full-stack real-time API monitoring system.

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          DEVELOPER'S APP                                │
│                                                                         │
│   import 'apio-cli/register';   ← monkey-patches Node http/https   │
│                                                                         │
│   app.get('/users', ...)            ← makes outgoing HTTP calls         │
│       └── axios.get('https://api.stripe.com/...')                       │
└────────────────────┤────────────────────────────────────────────────────┘
                     │ captured by interceptor
                     │ POST /api/v1/ingest
                     │ Body: { sdkToken, projectId, events[] }
                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                    NGINX (port 80/443)                                  │
│    ip_hash load balancer (sticky sessions — same client → same backend) │
│         upstream: nestjs_1:4000, nestjs_2:4000                          │
└──────────────┬───────────────────────────┬─────────────────────────────┘
               │                           │
               ▼                           ▼
┌──────────────────────┐     ┌──────────────────────┐
│  NestJS API          │     │  NestJS API           │
│  Instance 1 :4000    │     │  Instance 2 :4001     │
│                      │     │                       │
│  REST + WebSocket    │     │  REST + WebSocket     │
│  Gateway             │     │  Gateway              │
└──────────┬───────────┘     └───────────┬───────────┘
           │                             │
           │ enqueue job (~5ms)          │
           └──────────┬──────────────────┘
                      │
                      ▼
         ┌────────────────────────┐
         │    Redis               │
         │  ┌────────────────┐    │
         │  │ BullMQ Queue   │    │  ← ingest jobs buffered here
         │  └────────────────┘    │
         │  ┌────────────────┐    │
         │  │ Socket.io Pub/ │    │  ← WS events synced across instances
         │  │ Sub Adapter    │    │
         │  └────────────────┘    │
         │  ┌────────────────┐    │
         │  │ Cache (TTL)    │    │  ← API response caching
         │  └────────────────┘    │
         └──────────┬─────────────┘
                    │
                    ▼
         ┌──────────────────────┐
         │  BullMQ Worker       │
         │  (Separate process)  │
         │                      │
         │  ┌────────────────┐  │
         │  │ IngestProcessor│  │  ← processes queued jobs
         │  └──────┬─────────┘  │
         └─────────┼────────────┘
                   │
        ┌──────────┴──────────┐
        │                     │
        ▼                     ▼
┌───────────────┐    ┌────────────────────────────┐
│ MongoDB Atlas │    │ WebSocket emit via Redis    │
│               │    │ adapter (reaches ALL        │
│ ApiCall.create│    │ connected frontend clients) │
│ (parallel     │    └────────────────────────────┘
│  Promise.all) │
└───────────────┘
```

---

## Frontend Architecture

```
Browser
  │
  ├── http://localhost:3000  (apps/web — Dashboard + Landing)
  │       └── WebSocket connection to ws://localhost:4000
  │
  ├── http://localhost:3001  (apps/auth — Login/Register)
  │       └── Redirects to :3000 after login
  │
  ├── http://localhost:3002  (apps/docs — Documentation)
  │       └── No API calls — fully static
  │
  └── http://localhost:3003  (apps/admin — Admin Panel)
```

---

## Data Flow — Single API Call Event

```
1. Developer's app makes HTTP request:
   GET https://api.stripe.com/v1/charges

2. CLI interceptor captures:
   {
     method: "GET",
     url: "https://api.stripe.com/v1/charges",
     statusCode: 200,
     latency: 245,
     startedAt: "2024-01-15T10:30:00.000Z",
     endedAt: "2024-01-15T10:30:00.245Z"
   }

3. POST http://localhost:4000/api/v1/ingest
Body: { sdkToken: "sdk_abc123...", projectId: "PROJECT_ID", events: [...] }
   Body: { events: [...] }

4. NestJS validates SDK token (from body) → validates projectId → enqueues BullMQ job (~5ms response, 202 Accepted)

5. BullMQ Worker dequeues job:
   a. Promise.all → prisma.apiCall.create(...) per event → MongoDB Atlas
   b. eventsService.emitApiCall(projectId, record) → Socket.io
   c. Debounced stats broadcast (5s debounce window; queries last 1 hour of data)

6. Socket.io Redis adapter publishes to all instances

7. Dashboard client receives "api:call" event → live feed updates
```

---

## Caching Strategy

| Layer | Technology | TTL | Eviction Trigger |
|---|---|---|---|
| Project stats | Redis | 30s | New ingest batch processed |
| Call history (paginated) | Redis | 15s | New ingest batch processed |
| Single call detail | Redis | 60s | Never (immutable once written) |
| Analytics summary (per range) | Redis | 30s | New ingest batch — 4 keys: `1h`, `24h`, `7d`, `30d` |
| Top endpoints | Redis | 60s | New ingest batch processed |

Cache is busted by the BullMQ worker via `CacheService.del()` after each batch. Pattern-based deletion (`delByPattern`) clears all history pages for a project.

---

## Security Model

```
┌───────────────────────────────────────────────────────┐
│ Auth Layer                                            │
│                                                       │
│  JWT Access Token  (15 min expiry)                    │
│  ├── Used for: All dashboard API calls                │
│  └── Stored in: sessionStorage (per-tab isolation)    │
│                                                       │
│  JWT Refresh Token (7 days expiry)                    │
│  ├── Used for: Rotating access tokens                 │
│  └── Stored in: sessionStorage (per-tab isolation)    │
│                                                       │
│  SDK Token  (sdk_<48 hex chars>, never expires)       │
│  ├── Used for: CLI → backend ingest                   │
│  └── Can be regenerated: POST /projects/:id/token     │
└───────────────────────────────────────────────────────┘
```

---

## Horizontal Scaling

The system is designed to scale horizontally:

| Component | How it scales |
|---|---|
| NestJS API | Multiple instances on different ports (`4000`, `4001`, …) behind NGINX |
| BullMQ Worker | Add more worker processes (each pulls from same queue) |
| MongoDB | Atlas auto-scales; add read replicas for analytics queries |
| Redis | Upgrade to Redis Cluster (supported via `REDIS_CLUSTER_NODES` env var) |
| Frontend | Edge-deployed via Vercel — global CDN |

**Each instance binds to its own Docker container** — in Docker Compose both expose port `4000` *inside* the container, but are mapped to host ports `4000` and `4001`. NGINX routes by `ip_hash` (sticky sessions) for WebSocket stability:

```nginx
upstream nestjs_api {
    ip_hash;                             # sticky: same client IP → same backend
    server nestjs_1:4000 max_fails=3;   # Docker hostname, not 127.0.0.1
    server nestjs_2:4000 max_fails=3;
}
```

In Docker, each container has its own network namespace so both can expose `4000` internally — but on a bare-metal or Railway deployment they must use `4000` and `4001`.

**Key**: All API instances share Redis for:
1. **BullMQ** — job queue (any instance can enqueue; worker consumes from the same queue)
2. **Socket.io adapter** — pub/sub so Instance 1 can push a WS event to a client connected on Instance 2
3. **Cache** — shared TTL cache (any instance serves a cache hit, any instance busts it)

---

## Turborepo Build Graph

```
packages/typescript-config   ← no deps, builds first
packages/shared              ← depends on typescript-config
      │
      ├── apps/web           ← depends on shared
      ├── apps/auth          ← depends on shared
      ├── apps/docs          ← no shared dep (optional)
      └── apps/backend       ← no shared dep (independent)
      
apps/cli                     ← independent (public npm package)
apps/admin                   ← depends on shared (optional)
```

Turborepo's `"dependsOn": ["^build"]` ensures packages build in this exact order.

---

## Tech Stack Summary

| Layer | Technology | Version |
|---|---|---|
| Runtime (server) | Bun | 1.1+ |
| Runtime (CLI) | Node.js | ≥18 |
| API Framework | NestJS | 11 |
| Database ORM | Prisma | 6 |
| Database | MongoDB Atlas | 7+ |
| Queue | BullMQ | 5 |
| Cache / Pub-sub | Redis (Upstash) | 7 |
| WebSockets | Socket.io | 4 |
| Frontend framework | Next.js | 16 |
| UI library | React | 19 |
| Styling | Tailwind CSS v4 + SCSS Modules | — |
| Build orchestrator | Turborepo | 2.5+ |
| Package manager | Bun (workspaces) | 1.1+ |
| CI/CD | GitHub Actions | — |
| Deployment (frontend) | Vercel | — |
| Deployment (backend) | Railway | — |
