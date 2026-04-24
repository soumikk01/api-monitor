# Backend — `apps/backend`

> **NestJS 11 · MongoDB Atlas · Redis · BullMQ · Socket.io · Prisma 6**  
> REST API server + WebSocket gateway + BullMQ worker process.

---

## Local URL

```
http://localhost:4000
```

API is served under the prefix `/api/v1`.  
Health check: `http://localhost:4000/health` (no auth, no prefix)

---

## Directory Structure

```
apps/backend/
├── Dockerfile              ← Production image (API server)
├── Dockerfile.worker       ← Production image (BullMQ worker process)
├── docker-compose.yml      ← Local multi-container setup (NGINX + 2× NestJS + worker)
├── nest-cli.json           ← NestJS CLI config
├── prisma/
│   └── schema.prisma       ← Database schema (MongoDB via Prisma ORM)
├── nginx/
│   └── nginx.conf          ← NGINX reverse proxy config
└── src/
    ├── main.ts             ← HTTP API entry point
    ├── worker.ts           ← Standalone BullMQ worker entry point
    ├── app.module.ts       ← Root NestJS module (wires everything)
    ├── app.controller.ts   ← GET /health endpoint
    │
    ├── auth/               ← JWT authentication (register / login / refresh)
    ├── users/              ← User profile management
    ├── projects/           ← Project CRUD + SDK token management
    ├── ingest/             ← POST /ingest — receive API call events from CLI
    ├── events/             ← WebSocket gateway + Redis pub/sub adapter
    ├── history/            ← Paginated API call history (with caching)
    ├── analytics/          ← Aggregated metrics (error rate, latency, top endpoints)
    ├── audit/              ← Audit log (tracks user actions)
    ├── cache/              ← Redis cache abstraction (get/set/del/delByPattern)
    └── prisma/             ← Prisma client singleton service
```

---

## Environment Variables

Copy `apps/backend/.env.example` → `apps/backend/.env` and fill in:

```env
NODE_ENV=development
PORT=4000

# MongoDB Atlas connection string
DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/api_monitor

# Redis — use Upstash free tier or local Redis
REDIS_URL=redis://localhost:6379
# For Upstash: rediss://:password@host.upstash.io:6379

# JWT — generate with: openssl rand -base64 64
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRY=15m
JWT_REFRESH_SECRET=another-secret-key
JWT_REFRESH_EXPIRY=7d

# Allowed CORS origins per app (override in production)
FRONTEND_URL=http://localhost:3000   # web app
AUTH_URL=http://localhost:3001       # auth app
DOCS_URL=http://localhost:3002       # docs app
ADMIN_URL=http://localhost:3003      # admin app
```

---

## Running Locally

```bash
# From repo root — all apps including backend
bun turbo dev

# From repo root — backend only
bun turbo dev --filter=@api-monitor/backend

# Run BullMQ worker separately (different terminal)
bun run dev:worker

# Or from apps/backend directly
cd apps/backend
bun run dev                # Watch mode — API server on port 4000
bun run start:prod:bun     # Production: run compiled dist/main
bun run start:prod2:bun    # Production: second instance on PORT=4001
bun run worker:bun         # Production: run compiled dist/worker
```

---

## Building

```bash
# From apps/backend
bun run build              # prisma generate + nest build → outputs to dist/
bun run build:clean        # Clean dist/ then rebuild

# The build outputs two entry points:
# dist/main.js    ← HTTP API server
# dist/worker.js  ← BullMQ background worker
```

---

## Architecture — Two Processes

The backend runs as **two separate processes** in production:

### 1. API Server (`dist/main.js`)
- Handles all HTTP requests and WebSocket connections
- On `POST /api/v1/ingest/:projectId` — validates the payload and **enqueues** a BullMQ job (~5ms)
- Does NOT write to the database directly in the request path
- Horizontally scalable — run N instances behind NGINX

### 2. BullMQ Worker (`dist/worker.js`)
- Standalone `NestFactory.createApplicationContext` (no HTTP server)
- Dequeues ingest jobs from Redis
- Writes `ApiCall` records to MongoDB in parallel (`Promise.all`)
- Broadcasts WebSocket events back to connected frontends via Redis pub/sub adapter
- Debounces stats broadcasts per project (5-second window)

```
CLI/SDK ──POST──▶ API Server ──enqueue──▶ Redis Queue
                                                │
                                                ▼
                                         BullMQ Worker
                                          ├── MongoDB write
                                          ├── WS emit (via Redis adapter)
                                          └── Cache bust
```

---

## API Endpoints

| Method | Path | Auth | Description |
|---|---|---|---|
| `GET` | `/health` | None | Health check — Redis + DB + queue status |
| `POST` | `/api/v1/auth/register` | None | Register new user |
| `POST` | `/api/v1/auth/login` | None | Login → access + refresh tokens |
| `POST` | `/api/v1/auth/refresh` | None | Rotate access token using refresh token |
| `GET` | `/api/v1/users/me` | JWT | Get current user profile |
| `GET` | `/api/v1/projects` | JWT | List user's projects |
| `POST` | `/api/v1/projects` | JWT | Create project |
| `GET` | `/api/v1/projects/:id` | JWT | Get project detail |
| `PATCH` | `/api/v1/projects/:id` | JWT | Update project |
| `DELETE` | `/api/v1/projects/:id` | JWT | Delete project |
| `POST` | `/api/v1/projects/:id/token` | JWT | Regenerate SDK token |
| `POST` | `/api/v1/ingest/:projectId` | SDK Token | Receive API call events from CLI |
| `GET` | `/api/v1/history` | JWT | Paginated API call history |
| `GET` | `/api/v1/history/:id` | JWT | Single API call detail |
| `GET` | `/api/v1/analytics/summary` | JWT | Error rate, latency, call volume |
| `GET` | `/api/v1/analytics/endpoints` | JWT | Top endpoints breakdown |
| `GET` | `/api/v1/audit` | JWT | Audit log for a project |

---

## WebSocket Events (Socket.io)

Connect to `ws://localhost:4000` and join a project room:

```ts
socket.emit('join', { projectId: 'your-project-id', token: 'jwt-access-token' });
```

Events you can listen to:

| Event | Payload | Description |
|---|---|---|
| `api:call` | `ApiCall` object | New API call recorded |
| `api:error` | `{ id, error }` | Error call shorthand |
| `api:stats` | `{ total, errorRate, avgLatency }` | Aggregated stats update (debounced 5s) |

---

## Redis Cache Keys

| Key Pattern | TTL | Description |
|---|---|---|
| `stats:{projectId}` | 30s | Project stats summary |
| `calls:{projectId}:50` | 15s | Last 50 API calls |
| `history:{projectId}:p*` | 15s | Paginated history pages |
| `history:call:{id}` | 60s | Single call detail (immutable) |
| `analytics:summary:{projectId}:{range}` | 30s | Analytics summary per time range |
| `analytics:endpoints:{projectId}` | 60s | Top endpoints |

---

## Database (Prisma)

```bash
# Generate Prisma client (required after schema changes)
bun run prisma generate

# Open Prisma Studio (database GUI)
bun run prisma studio

# Push schema to database (dev only — not safe for production)
bun run prisma db push
```

Schema file: `apps/backend/prisma/schema.prisma`  
Full schema docs: [DATABASE.md](./DATABASE.md)

---

## Rate Limiting

Global throttle: **200 requests / 60 seconds** per IP (configurable via `ThrottlerModule`).

---

## Security

- `helmet` — sets HTTP security headers
- `compression` — gzip/brotli on all responses
- `ValidationPipe` — strips unknown fields (`whitelist: true`), auto-transforms types
- JWT access tokens expire in 15 minutes; refresh tokens in 7 days
- SDK tokens are unique per-user random hex strings (`sdk_` prefix)

---

## Testing

```bash
cd apps/backend
bun run test          # Unit tests (Jest)
bun run test:cov      # Coverage report
bun run test:e2e      # End-to-end tests
```
