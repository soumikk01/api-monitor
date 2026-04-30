<div align="center">
  <br />
  <h3>⚡ APIO</h3>
  <p><strong>The modern, real-time observability platform for your backend services.</strong></p>
  <br />

  <p>
    <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16+-black?style=for-the-badge&logo=next.js" alt="Next.js" /></a>
    <a href="https://nestjs.com/"><img src="https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white" alt="NestJS" /></a>
    <a href="https://www.mongodb.com/"><img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" /></a>
    <a href="https://bun.sh/"><img src="https://img.shields.io/badge/Bun-%23000000.svg?style=for-the-badge&logo=bun&logoColor=white" alt="Bun" /></a>
    <a href="https://turbo.build/"><img src="https://img.shields.io/badge/Turborepo-EF4444?style=for-the-badge&logo=turborepo&logoColor=white" alt="Turborepo" /></a>
  </p>
</div>

<hr />

## 📖 Overview

**Apio** is a professional, full-stack SaaS solution providing real-time, deep visibility into your application's API traffic. Whether you are debugging, monitoring performance latency, or ensuring production stability, Apio seamlessly intercepts HTTP requests and streams them to a beautiful dashboard in real-time.

Forget digging through terminal logs. Plug in the zero-config CLI tool and watch your traffic matrix light up instantly.

<br />

## ✨ Key Features

- **🔴 Real-Time Observability**: Powered by WebSockets + Socket.io, watch API traffic flow into the dashboard with zero delay.
- **🔌 Zero-Config Interceptor**: A drop-in `apio-cli` NPM package auto-patches `fetch`, `http`, and `https` natively. No code refactoring required.
- **🏗️ Turborepo Monorepo**: All apps managed together — one `bun install`, one `bun turbo dev`.
- **🔐 Per-Tab Security**: Tokens stored in `sessionStorage` — each browser tab has its own isolated session.
- **🧱 Horizontally Scalable Backend**: Two NestJS instances behind NGINX, synced via Redis pub/sub.
- **🎨 Multi-App Architecture**: Separate apps for Dashboard, Auth, Docs, and Admin.

<br />

## 🏗️ Repository Structure

```
api-monitor/                         ← Turborepo monorepo root
├── turbo.json                       ← Build pipeline + caching
├── package.json                     ← Root Bun workspace
├── bun.lock                         ← Single unified lockfile
├── .prettierrc                      ← Shared formatter
│
├── packages/
│   ├── typescript-config/           ← Shared tsconfig presets (base/nextjs/nestjs)
│   └── shared/                      ← Shared TypeScript types + constants
│
└── apps/
    ├── web/        → :3000          Next.js — Landing + Dashboard
    ├── auth/       → :3001          Next.js — Login / Register / Forgot Password
    ├── docs/       → :3002          Next.js — Documentation site
    ├── admin/      → :3003          Next.js — Admin panel
    ├── backend/    → :4000 / :4001  NestJS — REST API + WebSocket + BullMQ Worker
    └── cli/        → npm            apio-cli (published to npm)
```

<br />

## 🚀 Getting Started

### Prerequisites
- **Bun** ≥ 1.1.0
- **Node.js** ≥ 18 (for CLI)
- **MongoDB Atlas** account (or local MongoDB)
- **Redis** (local or [Upstash](https://upstash.com) free tier)

### Setup

```bash
# 1. Clone
git clone https://github.com/soumikk01/api-monitor.git
cd api-monitor

# 2. Install all dependencies (one command — Bun workspaces handles everything)
bun install

# 3. Configure backend environment
cp apps/backend/.env.example apps/backend/.env
# Edit apps/backend/.env with DATABASE_URL, REDIS_URL, JWT_SECRET, JWT_REFRESH_SECRET

# 4. Configure frontend environments
# apps/web/.env.local and apps/auth/.env.local already created with defaults

# 5. Generate Prisma client
cd apps/backend && bun run prisma generate && cd ../..

# 6. Start everything (parallel dev servers)
bun turbo dev
```

### Local URLs after `bun turbo dev`

| App | URL | Description |
|---|---|---|
| Dashboard | http://localhost:3000 | Main observability dashboard |
| Auth | http://localhost:3001 | Login / Register |
| Docs | http://localhost:3002 | Documentation |
| Admin | http://localhost:3003 | Admin panel |
| API | http://localhost:4000 | NestJS REST + WebSocket |

<br />

## 🛠️ Integrating the CLI

To monitor a separate backend application (e.g., your Express server):

**1. Generate your SDK Token**  
Log into the dashboard (`http://localhost:3000`) → Settings → **Get Command**.

**2. Initialize the interceptor in your app**
```bash
npx apio-cli init --token sdk_<YOUR_TOKEN>
```

**3. Add to your app's entry file**
```ts
// At the very top of your server entry point
import 'apio-cli/register';
```

**4. Watch the dashboard**  
Start your app. Apio will intercept every outgoing HTTP request and stream it to your dashboard in real-time.

<br />

## 📚 Documentation

Full developer docs in [`docs/`](./docs/):

| Topic | File |
|---|---|
| **Quick Start (all commands)** | [docs/QUICKSTART.md](./docs/QUICKSTART.md) |
| System Architecture | [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) |
| Database Schema | [docs/DATABASE.md](./docs/DATABASE.md) |
| Deployment Guide | [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) |
| Environment Variables | [docs/ENVIRONMENT.md](./docs/ENVIRONMENT.md) |
| Backend (NestJS) | [docs/backend.md](./docs/backend.md) |
| Web App | [docs/web.md](./docs/web.md) |
| Auth App | [docs/auth.md](./docs/auth.md) |
| CLI Package | [docs/cli.md](./docs/cli.md) |

Developer onboarding: [CONTRIBUTING.md](./CONTRIBUTING.md)

<br />

## 📜 License

Internal SaaS Architecture — All rights reserved.
