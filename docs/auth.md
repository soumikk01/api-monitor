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
├── tsconfig.json           ← extends @api-monitor/typescript-config/nextjs.json
└── src/
    ├── app/
    │   ├── layout.tsx              ← Root layout (fonts, globals — minimal)
    │   ├── login/
    │   │   └── page.tsx            ← /login
    │   ├── register/
    │   │   └── page.tsx            ← /register
    │   └── forgot-password/
    │       └── page.tsx            ← /forgot-password
    │
    ├── features/
    │   └── auth/                   ← Extracted from apps/web
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
    │       │   └── useAuth.ts
    │       ├── services.ts         ← API calls to backend auth endpoints
    │       └── types.ts
    │
    └── styles/
        └── globals.scss            ← Shared with apps/web (copy or symlink)
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
3. `services.ts` calls `POST http://localhost:4000/api/v1/auth/login`
4. Backend returns `{ accessToken, refreshToken }`
5. Tokens stored in `localStorage`
6. User redirected to `http://localhost:3000/dashboard`

### Register

1. User visits `http://localhost:3001/register`
2. Submits name + email + password
3. `POST http://localhost:4000/api/v1/auth/register`
4. Same token flow as login

### Forgot Password

1. User visits `http://localhost:3001/forgot-password`
2. Email submitted
3. Backend sends reset email (implementation pending)

### Token Refresh

- `fetchWithAuth.ts` (from `@api-monitor/shared`) automatically refreshes tokens
- If `access_token` is expired, calls `POST /api/v1/auth/refresh` with `refresh_token`
- On refresh failure → clears tokens → redirects to `/login`

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
| Successful login | `http://localhost:3000/dashboard` |
| Already logged in → visit `/login` | `http://localhost:3000/dashboard` |
| Logout from dashboard | `http://localhost:3001/login` |
| Token expired + refresh fails | `http://localhost:3001/login` |

---

## Package Dependencies

```json
{
  "dependencies": {
    "@api-monitor/shared": "*",
    "next": "16.2.2",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  }
}
```

Deliberately minimal — no Socket.io, no charting libraries, no dashboard code.
