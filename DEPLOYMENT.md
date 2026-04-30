# Deployment Guide

> Production deployment strategy for all apps.

---

## Overview

| App | Platform | Trigger |
|---|---|---|
| `apps/web` | Vercel | Push to `main` |
| `apps/auth` | Vercel | Push to `main` |
| `apps/docs` | Vercel | Push to `main` |
| `apps/admin` | Vercel | Push to `main` |
| `apps/backend` | Railway | Push to `main` |
| `apps/cli` | npm registry | Manual `npm publish` |

---

## Vercel — Frontend Apps

### Setup (one-time per app)

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import `soumikk01/api-monitor` from GitHub
3. Set **Root Directory** (critical!):

| Vercel Project | Root Directory |
|---|---|
| `apinest-web` | `apps/web` |
| `apinest-auth` | `apps/auth` |
| `apinest-docs` | `apps/docs` |
| `apinest-admin` | `apps/admin` |

4. Set **Framework Preset** → Next.js (auto-detected)
5. Add environment variables (see table below)
6. Deploy

### Vercel Environment Variables

**`apinest-web`:**
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_AUTH_URL=https://auth.yourdomain.com
```

**`apinest-auth`:**
```
NEXT_PUBLIC_API_URL=https://api.yourdomain.com
NEXT_PUBLIC_APP_URL=https://app.yourdomain.com
```

**`apinest-docs`:** *(none required)*

---

## Railway — Backend

### Setup (one-time)

1. Go to [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub**
2. Select `soumikk01/api-monitor`
3. In project settings → **Root Directory** → set to `apps/backend`
4. Railway auto-detects `railway.toml`

### `railway.toml` (already configured)

```toml
[build]
builder = "dockerfile"
dockerfilePath = "Dockerfile"

[deploy]
startCommand = "bun run dist/main"
healthcheckPath = "/health"
healthcheckTimeout = 30
```

### Railway Environment Variables

Set in Railway dashboard → Variables:

```
NODE_ENV=production
DATABASE_URL=mongodb+srv://...
REDIS_URL=rediss://:password@host.upstash.io:6379
JWT_SECRET=<generated>
JWT_REFRESH_SECRET=<generated>
FRONTEND_URL=https://app.yourdomain.com
```

### Worker Deployment

Deploy the BullMQ worker as a **second Railway service** pointing to the same repo:

1. **New Service** → same GitHub repo
2. Root Directory: `apps/backend`
3. Start Command: `bun run dist/worker`
4. Same environment variables as the API service

---

## Docker (Self-Hosted)

Run the backend locally or on a VPS using Docker Compose:

```bash
cd apps/backend

# Copy and fill in env vars
cp .env.example .env
# Edit .env with your values

# Build and start (NGINX + 2× NestJS + 1× Worker)
docker compose up -d

# View logs
docker compose logs -f

# Rebuild after code changes
docker compose up -d --build
```

**Services started:**

| Service | Port | Description |
|---|---|---|
| `nginx` | 80, 443 | Load balancer — proxies to `:4000` and `:4001` |
| `nestjs_1` | **4000** | NestJS API — Instance 1 |
| `nestjs_2` | **4001** | NestJS API — Instance 2 |
| `worker` | — | BullMQ worker (no port — queue consumer only) |

> **Why different ports?** Each OS process must bind to a unique port. In Docker each container has its own network namespace so both *could* use `4000` internally, but exposing them on `4000` and `4001` to the host is the correct, transparent approach — NGINX then load-balances between `127.0.0.1:4000` and `127.0.0.1:4001`.

> Note: Redis is NOT containerized — use a managed Redis (Upstash/Redis Cloud) even locally for simplicity.

---

## CLI — npm Publish

```bash
cd apps/cli

# 1. Bump version in package.json
# 2. Build
bun run build

# 3. Publish
npm publish

# Verify
npm info api-nest-cli
```

---

## CI/CD Pipeline (GitHub Actions)

### CI (`.github/workflows/ci.yml`)

Runs on every push to `main` and `develop`, and every PR:

```
Push → Lint all → TypeCheck all → Build all
         (turbo)      (turbo)       (turbo)
```

Turborepo caches all three steps — only changed packages re-run.

### CD (`.github/workflows/cd.yml`)

Runs on push to `main` only:

- Vercel: Auto-deploys via Vercel's GitHub integration (no action needed)
- Railway: Auto-deploys via Railway's GitHub integration (no action needed)

---

## Health Check

Backend health endpoint (no auth required):

```bash
curl http://localhost:4000/health
```

Response:
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "uptime": 3600,
  "redis": "connected",
  "db": "connected",
  "queue": { "pending": 0 }
}
```

NGINX and Railway use this endpoint for health checks before routing traffic.

---

## Rollback

### Vercel rollback

Vercel dashboard → Deployments → click any previous deployment → **Promote to Production**

### Railway rollback

Railway dashboard → Deployments → click previous deployment → **Redeploy**
