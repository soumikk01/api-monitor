# Apio — Monorepo Developer Guide

> **Stack**: Bun · Next.js 16 · NestJS 11 · MongoDB Atlas · Redis · BullMQ · Turborepo  
> **Runtime**: All apps run with [Bun](https://bun.sh). Node ≥18 is required for the CLI.

---

## Repository Structure

```
api-monitor/
├── turbo.json                       ← Turborepo pipeline (build order + caching)
├── package.json                     ← Root workspace (bun workspaces)
├── bun.lock                         ← Single unified lockfile
├── .prettierrc                      ← Shared formatter (all packages)
│
├── packages/                        ← Internal shared packages (private, never published)
│   ├── typescript-config/           ← Shared tsconfig presets (base / nextjs / nestjs)
│   └── shared/                      ← Shared types, API client, utilities
│
└── apps/
    ├── web/        → http://localhost:3000   (Next.js — Landing + Dashboard)
    ├── auth/       → http://localhost:3001   (Next.js — Login / Register)
    ├── docs/       → http://localhost:3002   (Next.js — Documentation)
    ├── admin/      → http://localhost:3003   (Next.js — Admin Panel)
    ├── backend/    → http://localhost:4000   (NestJS — REST API + WebSocket)
    └── cli/        → npm package `apio-cli` (published to npm)
```

---

## Local Ports

| App | Port | Description |
|---|---|---|
| `apps/web` | 3000 | Main dashboard + landing page |
| `apps/auth` | 3001 | Authentication flows |
| `apps/docs` | 3002 | Documentation site |
| `apps/admin` | 3003 | Admin panel |
| `apps/backend` | 4000 | NestJS REST API + WebSocket server |
| Redis | 6379 | Local Redis (or use Upstash URL) |

---

## Prerequisites

```bash
# Install Bun (if not already installed)
curl -fsSL https://bun.sh/install | bash   # macOS / Linux
powershell -c "irm bun.sh/install.ps1 | iex"  # Windows

# Install Turborepo globally (optional but recommended)
bun add -g turbo
```

---

## First-Time Setup

```bash
# 1. Clone the repo
git clone https://github.com/soumikk01/api-monitor.git
cd api-monitor

# 2. Install ALL dependencies (one command installs everything)
bun install

# 3. Set up environment files
cp apps/backend/.env.example apps/backend/.env
cp apps/web/.env.local.example apps/web/.env.local
cp apps/auth/.env.local.example apps/auth/.env.local

# 4. Fill in your secrets (see docs/ENVIRONMENT.md)
# Minimum required: DATABASE_URL, REDIS_URL, JWT_SECRET

# 5. Generate Prisma client
cd apps/backend && bun run prisma generate && cd ../..

# 6. Start everything at once
bun turbo dev
```

---

## Common Commands

Run from the **repository root**.

```bash
# Start all apps in watch mode (parallel)
bun turbo dev

# Start a single app
bun turbo dev --filter=@api-monitor/web
bun turbo dev --filter=@api-monitor/backend

# Build all
bun turbo build

# Build only what changed since last commit
bun turbo build --filter=...[HEAD^1]

# Lint all
bun turbo lint

# Type-check all
bun turbo typecheck

# Test all
bun turbo test

# Format all files
bun run format

# Clean all build artifacts
bun turbo clean
```

---

## Package-Specific Docs

| Package | Documentation |
|---|---|
| `apps/backend` | [docs/backend.md](./docs/backend.md) |
| `apps/web` | [docs/web.md](./docs/web.md) |
| `apps/auth` | [docs/auth.md](./docs/auth.md) |
| `apps/docs` | [docs/docs-app.md](./docs/docs-app.md) |
| `apps/cli` | [docs/cli.md](./docs/cli.md) |
| `packages/shared` | [docs/shared.md](./docs/shared.md) |
| Environment Variables | [docs/ENVIRONMENT.md](./docs/ENVIRONMENT.md) |
| System Architecture | [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) |
| Database Schema | [docs/DATABASE.md](./docs/DATABASE.md) |
| Deployment | [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) |

---

## Branch Strategy

```
main        ← production (protected, requires PR)
develop     ← integration branch (merge PRs here first)
feature/*   ← feature branches (branch from develop)
fix/*       ← bug fix branches
```

---

## Pull Request Checklist

- [ ] `bun turbo lint` passes with zero errors
- [ ] `bun turbo typecheck` passes
- [ ] `bun turbo build` succeeds for affected packages
- [ ] No secrets or `.env` files committed
- [ ] PR description explains the change

---

## Getting Help

- Read the package-specific `.md` file linked above first.
- Check `apps/backend/.env.example` for required environment variables.
- Open an issue or ask in the team Slack `#apio-dev`.
