# Shared Package — `packages/shared`

> **Internal package — never published to npm**  
> Shared TypeScript constants and type definitions used across `apps/web`, `apps/auth`, and `apps/docs`.

---

## Package Name

```
@api-monitor/shared
```

Used in other apps as:

```json
{ "dependencies": { "@api-monitor/shared": "*" } }
```

---

## Directory Structure

```
packages/shared/
├── package.json
├── tsconfig.json           ← extends @api-monitor/typescript-config/base.json
└── src/
    ├── index.ts            ← Barrel export
    ├── constants.ts        ← URL constants (AUTH_APP_URL, BACKEND_URL, APP_URL)
    └── types/
        └── index.ts        ← Shared TypeScript interfaces (User, Project, ApiCall, etc.)
```

> **Note**: `fetchWithAuth.ts`, `api.ts`, and `helpers.ts` are **NOT** in `packages/shared`.
> They live locally inside each app that needs them:
> - `apps/web/src/lib/fetchWithAuth.ts`
> - `apps/auth/src/lib/fetchWithAuth.ts`
> This is intentional — each app manages its own auth flow independently.

---

## Exports

```ts
// packages/shared/src/index.ts
export * from './constants';
export * from './types';
```

---

## `constants.ts`

```ts
export const STORAGE_KEYS = {
  ACCESS_TOKEN:  'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

export const AUTH_APP_URL   = process.env.NEXT_PUBLIC_AUTH_URL  ?? 'http://localhost:3001';
export const BACKEND_URL    = process.env.NEXT_PUBLIC_API_URL   ?? 'http://localhost:4000';
export const APP_URL        = process.env.NEXT_PUBLIC_APP_URL   ?? 'http://localhost:3000';
export const DOCS_URL       = process.env.NEXT_PUBLIC_DOCS_URL  ?? 'http://localhost:3002';
```

---

## Shared Types (`types/index.ts`)

```ts
export interface User {
  id: string;
  email: string;
  name?: string;
  sdkToken: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description?: string;
  slug?: string;
  userId: string;
  createdAt: string;
}

export interface ApiCall {
  id: string;
  projectId: string;
  method: string;
  url: string;
  host: string;
  path: string;
  statusCode?: number;
  statusText?: string;
  latency: number;
  status: 'SUCCESS' | 'CLIENT_ERROR' | 'SERVER_ERROR' | 'PENDING';
  startedAt: string;
  endedAt: string;
  createdAt: string;
}

export interface ApiStats {
  total: number;
  errorRate: number;       // percentage 0-100
  avgLatency: number;      // milliseconds
}
```

---

## Adding to This Package

1. Create your file in `packages/shared/src/`
2. Export it from `packages/shared/src/index.ts`
3. Use in any app: `import { yourUtil } from '@api-monitor/shared'`

No build step needed — Bun resolves TypeScript directly via `workspaces`.

---

## What Does NOT Belong Here

| Utility | Reason | Where it lives |
|---|---|---|
| `fetchWithAuth` | Uses `sessionStorage` (browser API) — requires per-app auth URL config | `apps/web/src/lib/` and `apps/auth/src/lib/` |
| `api.ts` | Uses `NEXT_PUBLIC_API_URL` — varies per app | Per-app `src/lib/` |
| `helpers.ts` | App-specific formatting | `apps/web/src/lib/` |
