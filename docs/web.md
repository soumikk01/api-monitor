# Web App — `apps/web`

> **Next.js 16 · React 19 · TypeScript · Tailwind CSS v4 · SCSS Modules**  
> Main dashboard + landing page. Served at `http://localhost:3000`.

---

## Local URL

```
http://localhost:3000
```

---

## Directory Structure

```
apps/web/
├── next.config.ts          ← Next.js configuration
├── tsconfig.json           ← extends @api-monitor/typescript-config/nextjs.json
├── postcss.config.mjs      ← Tailwind CSS v4 PostCSS integration
└── src/
    ├── app/                          ← Next.js App Router
    │   ├── layout.tsx                ← Root layout (fonts, globals)
    │   ├── page.tsx                  ← Landing page (/)
    │   ├── (dashboard)/              ← Route group — all dashboard routes
    │   │   ├── layout.tsx            ← Dashboard layout (sidebar + navbar)
    │   │   ├── overview/             ← /overview
    │   │   ├── dashboard/            ← /dashboard
    │   │   ├── monitor/              ← /monitor (live WebSocket feed)
    │   │   ├── analytics/            ← /analytics
    │   │   ├── history/              ← /history (paginated API call log)
    │   │   ├── projects/             ← /projects (project list)
    │   │   ├── manage/               ← /manage (project settings)
    │   │   └── settings/             ← /settings (account settings)
    │   ├── docs/                     ← /docs (extracted → apps/docs after migration)
    │   └── status/                   ← /status (API status page)
    │
    ├── features/                     ← Feature-Sliced Design modules
    │   ├── landing/                  ← Landing page components
    │   ├── dashboard/                ← Dashboard page components
    │   ├── auth/                     ← Auth components (extracted → apps/auth after migration)
    │   └── monitor/                  ← Live monitor components
    │
    ├── components/                   ← Shared UI components
    │   ├── AuthGuard/                ← Redirects unauthenticated users
    │   ├── ButtonLogoSpinner/        ← Logo+spinner button variant
    │   ├── ConnectPanel/             ← CLI connection helper panel
    │   ├── LogoutOverlay/            ← Full-screen logout animation
    │   ├── ProjectSettingsSidebar/   ← Project settings sidebar
    │   ├── ProjectSidebar/           ← Project navigation sidebar
    │   ├── Shimmer/                  ← Loading skeleton shimmer
    │   ├── TopNavbar/                ← Top navigation bar
    │   ├── layout/                   ← Page layout wrappers
    │   └── ui/                       ← Generic UI primitives (Button, Badge, etc.)
    │
    ├── hooks/                        ← Shared React hooks
    │   ├── useAuth.ts                ← Auth state (JWT decode + redirect)
    │   ├── useFetch.ts               ← Generic data fetching with loading/error state
    │   ├── useMonitorSocket.ts       ← Socket.io connection for live monitor
    │   └── useTheme.ts               ← Dark/light mode toggle
    │
    ├── lib/                          ← Utilities and API client
    │   ├── api.ts                    ← Base fetch wrapper (will move → packages/shared)
    │   ├── fetchWithAuth.ts          ← Authenticated fetch (attaches JWT from localStorage)
    │   ├── constants.ts              ← App-wide constants
    │   ├── helpers.ts                ← Generic utility functions
    │   └── logger.ts                 ← Console logger wrapper
    │
    ├── styles/                       ← Global styles
    │   ├── globals.scss              ← CSS custom properties, resets, base styles
    │   └── tailwind.css              ← Tailwind v4 entry point
    │
    └── types/                        ← TypeScript type definitions
        └── index.ts
```

---

## Environment Variables

File: `apps/web/.env.local`

```env
# Backend API base URL
NEXT_PUBLIC_API_URL=http://localhost:4000

# Auth app URL (for redirects after logout, and login link on landing page)
NEXT_PUBLIC_AUTH_URL=http://localhost:3001

# Docs app URL (for "Docs" nav link on landing page)
NEXT_PUBLIC_DOCS_URL=http://localhost:3002
```

---

## Running Locally

```bash
# From repo root
bun turbo dev --filter=@api-monitor/web

# Or from apps/web directly
cd apps/web
bun run dev      # starts on http://localhost:3000
```

---

## Building

```bash
cd apps/web
bun run build    # Next.js production build → .next/
bun run start    # Serve production build locally
```

---

## Authentication Flow

1. User visits any `(dashboard)` route
2. `AuthGuard` component checks for JWT in `sessionStorage`
3. If missing → redirects to `http://localhost:3001/login` (auth app)
4. After successful login, auth app redirects back to `http://localhost:3000/projects`
5. JWT is decoded client-side to get user info (no server-side session)

**Token storage**: `sessionStorage` keys (per-tab — each tab has its own isolated session):
- `access_token` — short-lived JWT (15 min)
- `refresh_token` — long-lived refresh token (7 days)

---

## WebSocket (Live Monitor)

`useMonitorSocket` hook connects to `ws://localhost:4000`:

```ts
const { calls, stats, connected } = useMonitorSocket(projectId, accessToken);
```

Events received:
- `api:call` → appends to live feed
- `api:stats` → updates error rate / latency counters
- `api:error` → highlights error row

---

## Code Style

- **Feature-Sliced Design**: All page logic lives in `features/`. Routes in `app/` are thin re-exports.
- **CSS Modules (.module.scss)** for component-scoped styles
- **Tailwind v4** for utility classes in global/layout contexts
- **No default exports** from `features/` — always use named barrel exports via `index.ts`

---

## Performance Optimizations

| Technique | Where applied |
|---|---|
| `next/dynamic` code splitting | Landing page (heavy 3D components) |
| `optimizePackageImports` | `lucide-react`, `react-icons` (tree-shaking) |
| `avif`/`webp` image formats | All `<Image>` components via `next.config.ts` |
| Gzip compression | Enabled in `next.config.ts` |
| `next/font` self-hosted | Space Grotesk, Inter, Fira Code, JetBrains Mono |

---

## Linting

```bash
cd apps/web
bun run lint         # ESLint with Next.js rules
bun run tsc --noEmit # TypeScript type check only
```
