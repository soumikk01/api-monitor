# Shared Package — `packages/shared`

> **Internal package — never published to npm**  
> Shared TypeScript utilities, API client, and type definitions used across `apps/web`, `apps/auth`, and `apps/docs`.

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
    ├── index.ts            ← Barrel export (export everything from here)
    ├── api.ts              ← Base fetch wrapper (NEXT_PUBLIC_API_URL)
    ├── fetchWithAuth.ts    ← Authenticated fetch (auto-attaches + auto-refreshes JWT)
    ├── constants.ts        ← App-wide constants (API base URL key, localStorage keys)
    ├── helpers.ts          ← Utility functions (formatDate, classifyStatus, etc.)
    └── types/
        └── index.ts        ← Shared TypeScript interfaces (User, Project, ApiCall, etc.)
```

---

## Exports

```ts
// packages/shared/src/index.ts
export * from './api';
export * from './fetchWithAuth';
export * from './constants';
export * from './helpers';
export * from './types';
```

---

## `api.ts` — Base Fetch Wrapper

```ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, options);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
```

---

## `fetchWithAuth.ts` — Authenticated Fetch

Wraps `apiFetch` with:
1. Reads `access_token` from `localStorage`
2. Attaches as `Authorization: Bearer <token>` header
3. On 401 → calls `POST /api/v1/auth/refresh` with `refresh_token`
4. Retries the original request with new token
5. On second failure → clears tokens, redirects to `http://localhost:3001/login`

```ts
import { fetchWithAuth } from '@api-monitor/shared';

const data = await fetchWithAuth<Project[]>('/api/v1/projects');
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
```

---

## Shared Types

```ts
// packages/shared/src/types/index.ts

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
