# API Monitor — Claude Context

## Project Overview
Apio is a real-time API observability SaaS platform. It intercepts HTTP calls from your backend via an NPM SDK, streams them over WebSockets, and displays them in a glassmorphic dashboard.

## Monorepo Structure (Turborepo + Bun)
```
apps/
  web/       → Next.js 16 dashboard (port 3000) — main user dashboard
  auth/      → Next.js 16 auth app (port 3001) — login/register/forgot-password
  backend/   → NestJS API (port 4000) — REST + WebSocket server
  docs/      → Next.js docs site (port 3002)
  admin/     → Next.js admin panel (port 3003)
packages/    → shared utilities (future)
```

## Key Commands
```bash
bun run dev          # start all apps simultaneously (turbo)
bun run build        # production build all apps
bun run lint         # lint all apps
```

### Backend specific
```bash
cd apps/backend
bun run start:dev    # dev with watch mode
npx prisma db push   # push schema changes to MongoDB Atlas
npx prisma generate  # regenerate Prisma client after schema change
```

## Technology Stack
| Layer | Tech |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, SCSS Modules |
| Backend | NestJS 11, TypeScript, Prisma ORM |
| Database | MongoDB Atlas (via Prisma) |
| Cache/Queue | Redis (Upstash) + BullMQ |
| Real-time | Socket.io (with Redis adapter) |
| Auth | JWT (access 15m + refresh 7d), stored in sessionStorage |
| Styling | Vanilla CSS / SCSS Modules — NO Tailwind unless asked |
| Package Manager | Bun (NOT npm or yarn) |

## Architecture: Cross-App Auth Flow
1. User logs in at `apps/auth` (port 3001)
2. Tokens are passed as URL params to `apps/web` (port 3000): `?access_token=...&refresh_token=...`
3. `apps/web`'s `useAuth` hook strips tokens from URL and stores them in **sessionStorage** (per-tab)
4. All API calls use `fetchWithAuth()` which auto-refreshes on 401

## Important Patterns

### Auth Hook (`apps/web/src/features/auth/hooks/useAuth.ts`)
- Single source of truth for auth state
- Exposes: `user`, `isLoading`, `isAuthenticated`, `login`, `register`, `logout`, `logoutWithTransition`, `getCliCommand`
- On app load: validates token from sessionStorage, syncs avatar from DB to localStorage
- `syncAvatarToStorage(avatar)` helper keeps localStorage in sync with DB

### Avatar System
- Stored in MongoDB as `User.avatar: Int` (index 0–29)
- `apps/web/src/features/dashboard/components/AccountPage/avatars.ts` defines the AVATARS array
- On login/register/mount: DB avatar is synced to `localStorage('userAvatarIndex')` + `avatarChanged` event dispatched
- TopNavbar + AccountPage both listen to `avatarChanged` event to re-render

### API Layer
- Base: `http://localhost:4000/api/v1`
- Auth: JWT Bearer token in Authorization header
- No `lib/api.ts` — use `fetchWithAuth()` from `@/lib/fetchWithAuth` for authenticated calls
- Use plain `fetch()` for public endpoints

### Storage Strategy
| Data | Where |
|---|---|
| JWT tokens | `sessionStorage` (per-tab isolation) |
| Active project ID | `localStorage` (persists across tabs) |
| Avatar index | `localStorage` (synced from DB on auth) |

## Backend Module Map
```
src/
  auth/       → JWT auth, login, register, refresh
  users/      → user profile, SDK token, avatar
  projects/   → project CRUD, members, stats, recent calls
  ingest/     → SDK data ingestion (validates token, enqueues BullMQ job)
  events/     → Socket.io gateway + Redis pub/sub adapter
  analytics/  → endpoint analytics, time-series summaries
  history/    → paginated API call history
  audit/      → audit log entries
  cache/      → Redis cache service wrapper
  prisma/     → Prisma client singleton
```

## Prisma Schema Key Models
- `User` — id, email, password (hashed), name, sdkToken, avatar (Int, default 0)
- `Project` — id, name, description, userId, members (ProjectMember[])
- `ProjectMember` — projectId, userId, role (OWNER/MEMBER)
- `ApiCall` — all HTTP call data (method, url, status, latency, headers, body, etc.)
- `AuditLog` — admin audit trail

## Environment Variables

### `apps/web/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_AUTH_URL=http://localhost:3001
NEXT_PUBLIC_DOCS_URL=http://localhost:3002
NEXT_PUBLIC_ADMIN_URL=http://localhost:3003
```

### `apps/auth/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_AUTH_URL=http://localhost:3001
```

### `apps/backend/.env`
```
NODE_ENV=development
PORT=4000
DATABASE_URL=mongodb+srv://...
REDIS_URL=rediss://...
JWT_SECRET=...
JWT_REFRESH_SECRET=...
```

## Coding Rules & Conventions
1. **SCSS Modules only** — all styles in `.module.scss` files co-located with components
2. **Feature-Sliced Design** — code lives in `src/features/<feature>/components|hooks|...`
3. **No Tailwind** unless explicitly requested
4. **No `any` types** unless absolutely necessary and commented
5. **Prisma field naming** — camelCase in TypeScript, matches MongoDB document fields
6. **Never return `password` field** from user queries — always destructure it out
7. **Cache invalidation** — always bust relevant Redis keys after mutations in `projects.service.ts`
8. **DTO validation** — all NestJS endpoints use class-validator DTOs, never raw body access
9. **BullMQ jobs** — ingest writes go through the queue (ingest → BullMQ → worker → DB + WebSocket)
10. **Singleton refresh** — `fetchWithAuth.ts` has a singleton refresh promise to prevent concurrent refresh storms

## Known Placeholders (Not Yet Implemented)
- OAuth (Google / GitHub) — buttons exist but are disabled with `title="Coming soon"`
- Forgot Password API — UI exists but uses simulated delay; backend endpoints not yet built
- Admin app — scaffold only

## Do NOT Do These
- Do NOT use `router.push()` for cross-app navigation (auth→web are different ports) — use `window.location.href`
- Do NOT use Tailwind CSS classes
- Do NOT import from `@/lib/api` (file deleted — dead code)
- Do NOT access `window` at module top-level (use `typeof window !== 'undefined'` guards)
- Do NOT return passwords from Prisma queries
- Do NOT use `npm` or `yarn` — always use `bun`
