# Auth App — `apps/auth`

> **Next.js 16 · React 19 · TypeScript · SCSS Modules**  
> Standalone authentication application. Served at `http://localhost:3001`.

---

## Local URL

```
http://localhost:3001
```

---

## Why a Separate App?

Splitting auth into its own app:
- **Security isolation** — auth code can be audited independently
- **Independent deployments** — auth updates don't require a full web rebuild
- **Smaller bundle** — no dashboard code loaded on login page
- **Cleaner Turborepo caching** — auth rarely changes, so it's almost always cache-hit

---

## Directory Structure

```
apps/auth/
├── next.config.ts          ← Same config as apps/web
├── tsconfig.json
└── src/
    ├── app/
    │   ├── layout.tsx              ← Root layout (fonts, globals — minimal)
    │   ├── page.tsx                ← / → redirects to /login
    │   ├── login/
    │   │   └── page.tsx            ← /login
    │   ├── register/
    │   │   └── page.tsx            ← /register
    │   └── forgot-password/
    │       └── page.tsx            ← /forgot-password
    │
    ├── features/
    │   └── auth/                   ← Extracted from apps/web during migration
    │       ├── components/
    │       │   ├── LoginPage/
    │       │   │   ├── LoginPage.tsx
    │       │   │   └── LoginPage.module.scss
    │       │   ├── RegisterPage/
    │       │   │   ├── RegisterPage.tsx
    │       │   │   └── RegisterPage.module.scss
    │       │   └── ForgotPasswordPage/
    │       │       ├── ForgotPasswordPage.tsx
    │       │       └── ForgotPasswordPage.module.scss
    │       ├── hooks/
    │       │   └── useAuth.ts     ← Auth state hook (copied from apps/web)
    │       ├── services.ts         ← API calls to backend auth endpoints
    │       └── types.ts
    │
    ├── components/
    │   └── ButtonLogoSpinner/     ← Shared spinner (copied from apps/web)
    │
    ├── lib/
    │   └── fetchWithAuth.ts       ← Authenticated fetch (copied from apps/web)
    │
    └── styles/
        └── globals.scss            ← Design tokens (copied from apps/web)
```

---

## Environment Variables

File: `apps/auth/.env.local`

```env
# Backend API base URL
NEXT_PUBLIC_API_URL=http://localhost:4000

# Redirect destination after successful login
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Running Locally

```bash
# From repo root
bun turbo dev --filter=@api-monitor/auth

# Or from apps/auth directly
cd apps/auth
bun run dev      # starts on http://localhost:3001
```

---

## Authentication Flow (Detailed)

### Login

1. User visits `http://localhost:3001/login`
2. Submits email + password form
3. `useAuth.login()` calls `POST http://localhost:4000/api/v1/auth/login`
4. Backend returns `{ accessToken, refreshToken }`
5. Tokens stored in `sessionStorage` (per-tab — each tab has an isolated session)
6. User redirected to `http://localhost:3000/projects` via `window.location.href`

### Register

1. User visits `http://localhost:3001/register`
2. Submits name + email + password
3. `POST http://localhost:4000/api/v1/auth/register`
4. Same token + redirect flow as login

### Forgot Password

1. User visits `http://localhost:3001/forgot-password`
2. Email submitted → OTP sent (backend implementation pending)
3. OTP verified → redirected to `/login`

### Token Refresh

- `fetchWithAuth.ts` (in `apps/auth/src/lib/`) automatically refreshes tokens
- If `access_token` is expired, calls `POST /api/v1/auth/refresh` with `refresh_token`
- On refresh failure → clears sessionStorage → redirects to `http://localhost:3001/login`

---

## API Endpoints Used

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/v1/auth/register` | Create account |
| `POST` | `/api/v1/auth/login` | Login |
| `POST` | `/api/v1/auth/refresh` | Refresh access token |

---

## Redirect Map

| Scenario | Destination |
|---|---|
| Successful login | `http://localhost:3000/projects` |
| Successful register | `http://localhost:3000/projects` |
| Logout from dashboard | `http://localhost:3001/login` |
| Token expired + refresh fails | `http://localhost:3001/login` |
| Visit `/` (root) | Redirect to `/login` |

---

## Package Dependencies

```json
{
  "dependencies": {
    "next": "16.2.2",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  },
  "devDependencies": {
    "@api-monitor/typescript-config": "*",
    "sass": "^1.99.0",
    "typescript": "^5"
  }
}
```

Deliberately minimal — no Socket.io, no charting libraries, no dashboard code.  
`useAuth`, `fetchWithAuth`, and `ButtonLogoSpinner` are **copied** from `apps/web` at migration time, not imported from a shared package (to keep the bundle independent).
