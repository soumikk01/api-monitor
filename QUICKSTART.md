# Quickstart — Commands Reference

> Everything you need to install, run, and build the API Monitor monorepo.

---

## Prerequisites

| Tool | Version | Install |
|---|---|---|
| **Bun** | ≥ 1.1.0 | [bun.sh](https://bun.sh) |
| **Node.js** | ≥ 18 | [nodejs.org](https://nodejs.org) |
| MongoDB Atlas | any | [mongodb.com/atlas](https://www.mongodb.com/atlas) |
| Redis | any | Local or [Upstash](https://upstash.com) (free tier) |

---

## Step 1 — Install Dependencies

Run **once** from the repo root. Bun workspaces installs all apps and packages together:

```bash
bun install
```

This covers:
- `apps/web`, `apps/auth`, `apps/docs`, `apps/admin`, `apps/backend`, `apps/cli`
- `packages/shared`, `packages/typescript-config`

---

## Step 2 — Configure Environment (first time only)

```bash
# Copy the backend env template and fill it in
cp apps/backend/.env.example apps/backend/.env
```

Required values in `apps/backend/.env`:

```env
DATABASE_URL=mongodb+srv://user:password@cluster.mongodb.net/api_monitor
REDIS_URL=redis://localhost:6379
JWT_SECRET=<generate: openssl rand -base64 64>
JWT_REFRESH_SECRET=<generate: openssl rand -base64 64>
```

Frontend env files are pre-configured with localhost defaults — no changes needed for local dev.

---

## Step 3 — Generate Prisma Client (first time only)

```bash
cd apps/backend
bun run prisma generate
cd ../..
```

---

## 🚀 Running Apps

### Run Everything (recommended)

```bash
# From repo root — starts ALL apps in parallel
bun run dev
# or equivalently:
bun turbo dev
```

| App | URL | Description |
|---|---|---|
| Web (Dashboard) | http://localhost:3000 | Landing page + observability dashboard |
| Auth | http://localhost:3001 | Login / Register / Forgot Password |
| Docs | http://localhost:3002 | Documentation site |
| Admin | http://localhost:3003 | Admin panel |
| Backend API | http://localhost:4000 | NestJS REST API + WebSocket gateway |

---

### Run a Single App

```bash
# Using Turborepo filter (from repo root)
bun turbo dev --filter=@api-monitor/web
bun turbo dev --filter=@api-monitor/auth
bun turbo dev --filter=@api-monitor/docs
bun turbo dev --filter=@api-monitor/admin
bun turbo dev --filter=@api-monitor/backend

# Or go into the folder directly
cd apps/web     && bun run dev   # :3000
cd apps/auth    && bun run dev   # :3001
cd apps/docs    && bun run dev   # :3002
cd apps/admin   && bun run dev   # :3003
cd apps/backend && bun run dev   # :4000
```

---

### Backend — Advanced Scripts

```bash
cd apps/backend

# API server only (port 4000, watch mode)
bun run dev

# BullMQ worker only (no HTTP port — background job processor)
bun run dev:worker

# Both together (open two terminals)
bun run dev           # Terminal 1 — API server
bun run dev:worker    # Terminal 2 — BullMQ worker
```

---

## 🏗️ Building for Production

```bash
# Build ALL apps (Turborepo caches — fast on repeat builds)
bun run build
# or:
bun turbo build

# Build a specific app
bun turbo build --filter=@api-monitor/web
bun turbo build --filter=@api-monitor/backend
```

---

## 🗄️ Database Commands

```bash
cd apps/backend

# Generate Prisma client (run after any schema.prisma change)
bun run prisma generate

# Push schema to database (dev only — not safe for production)
bun run prisma db push

# Open Prisma Studio — visual database browser
bun run prisma studio
```

---

## 🧹 Useful Dev Commands

```bash
# Lint all apps
bun run lint

# Type-check all apps
bun run typecheck

# Run all tests
bun run test

# Format all files (Prettier)
bun run format

# Add a package to a specific app
bun add <package> --cwd apps/web
bun add <package> --cwd apps/backend
bun add <package> --cwd apps/auth

# Add a dev dependency to the repo root
bun add -D <package>
```

---

## 📋 Full Cheatsheet

```bash
# ── First-time setup ────────────────────────────────────────────────
bun install
cp apps/backend/.env.example apps/backend/.env   # fill in secrets
cd apps/backend && bun run prisma generate && cd ../..

# ── Every day ───────────────────────────────────────────────────────
bun turbo dev                                     # all apps

# ── Specific apps ───────────────────────────────────────────────────
bun turbo dev --filter=@api-monitor/web
bun turbo dev --filter=@api-monitor/backend

# ── Backend worker (separate terminal) ──────────────────────────────
cd apps/backend && bun run dev:worker

# ── Build ───────────────────────────────────────────────────────────
bun turbo build

# ── Add packages ────────────────────────────────────────────────────
bun add <pkg> --cwd apps/web
bun add -D <pkg>                                  # root dev dep
```

---

## ❓ Troubleshooting

| Problem | Solution |
|---|---|
| `Cannot connect to MongoDB` | Check `DATABASE_URL` in `apps/backend/.env` |
| `Redis connection refused` | Start Redis locally: `redis-server` or use Upstash URL |
| `Prisma client not found` | Run `cd apps/backend && bun run prisma generate` |
| `Port already in use` | Kill the process: `npx kill-port 3000` (or 3001/4000) |
| `Cannot resolve workspace` | Make sure `packageManager` is set in root `package.json` |
| Backend starts but crashes | Check `.env` has `JWT_SECRET` and `JWT_REFRESH_SECRET` set |

---

For full architecture details → [ARCHITECTURE.md](./ARCHITECTURE.md)  
For environment variables → [ENVIRONMENT.md](./ENVIRONMENT.md)  
For deployment → [DEPLOYMENT.md](./DEPLOYMENT.md)
