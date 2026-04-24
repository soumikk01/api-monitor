# Environment Variables Reference

> All environment variables used across every app in the monorepo.

---

## Quick Setup

```bash
# Backend (required)
cp apps/backend/.env.example apps/backend/.env

# Web app (required)
echo "NEXT_PUBLIC_API_URL=http://localhost:4000\nNEXT_PUBLIC_AUTH_URL=http://localhost:3001" > apps/web/.env.local

# Auth app (required)
echo "NEXT_PUBLIC_API_URL=http://localhost:4000\nNEXT_PUBLIC_APP_URL=http://localhost:3000" > apps/auth/.env.local

# Docs app — no env vars needed
```

---

## `apps/backend` — `.env`

| Variable | Required | Default | Description |
|---|---|---|---|
| `NODE_ENV` | Yes | `development` | `"development"` or `"production"` |
| `PORT` | No | `4000` | HTTP server port. Set to `4001` for the second instance |
| `DATABASE_URL` | **Yes** | — | MongoDB Atlas connection string |
| `REDIS_URL` | **Yes** | `redis://localhost:6379` | Redis URL (local or Upstash) |
| `REDIS_CLUSTER_NODES` | No | — | Comma-separated `host:port` list for Redis Cluster mode |
| `JWT_SECRET` | **Yes** | — | Secret for signing access tokens (min 32 chars) |
| `JWT_EXPIRY` | No | `15m` | Access token expiry |
| `JWT_REFRESH_SECRET` | **Yes** | — | Secret for signing refresh tokens |
| `JWT_REFRESH_EXPIRY` | No | `7d` | Refresh token expiry |
| `FRONTEND_URL` | No | `http://localhost:3000` | CORS origin — web app |
| `AUTH_URL` | No | `http://localhost:3001` | CORS origin — auth app |
| `DOCS_URL` | No | `http://localhost:3002` | CORS origin — docs app |
| `ADMIN_URL` | No | `http://localhost:3003` | CORS origin — admin app |

### Generating Secrets

```bash
# On macOS/Linux:
openssl rand -base64 64

# On Windows (PowerShell):
[System.Convert]::ToBase64String([System.Security.Cryptography.RandomNumberGenerator]::GetBytes(64))
```

### `DATABASE_URL` Format

```
# MongoDB Atlas:
mongodb+srv://username:password@cluster.mongodb.net/api_monitor?retryWrites=true&w=majority

# Local MongoDB:
mongodb://localhost:27017/api_monitor
```

### `REDIS_URL` Format

```
# Local Redis:
redis://localhost:6379

# Upstash (TLS — note rediss://, double-s):
rediss://:your-password@your-host.upstash.io:6379

# Redis Cloud:
redis://:your-password@your-host.redis.cloud:12345
```

> The backend auto-detects `rediss://` and enables TLS. No extra config needed.

---

## `apps/web` — `.env.local`

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | **Yes** | `http://localhost:4000` | Backend API base URL |
| `NEXT_PUBLIC_AUTH_URL` | No | `http://localhost:3001` | Auth app URL (for login/logout redirects and landing page links) |
| `NEXT_PUBLIC_DOCS_URL` | No | `http://localhost:3002` | Docs app URL (for "Docs" nav link on landing page) |

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_AUTH_URL=http://localhost:3001
NEXT_PUBLIC_DOCS_URL=http://localhost:3002
```

---

## `apps/auth` — `.env.local`

| Variable | Required | Default | Description |
|---|---|---|---|
| `NEXT_PUBLIC_API_URL` | **Yes** | `http://localhost:4000` | Backend API base URL |
| `NEXT_PUBLIC_APP_URL` | No | `http://localhost:3000` | Main web app URL (redirect after login) |

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## `apps/docs` — No env vars required

The docs app is fully static and makes no API calls.

---

## `apps/cli` — No env vars

The CLI uses a local `.api-nest.json` config file (created by `api-nest init`), not environment variables.

---

## Local Development — Minimal Required Set

To get everything running locally, you need **at minimum**:

```env
# apps/backend/.env
DATABASE_URL=mongodb+srv://...    # MongoDB Atlas URI
REDIS_URL=redis://localhost:6379  # local Redis
JWT_SECRET=any-32-char-string-here-for-local-dev
JWT_REFRESH_SECRET=another-32-char-string-here
```

```env
# apps/web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
```

```env
# apps/auth/.env.local
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## Security Rules

- **Never commit `.env` files** — they are gitignored
- **Never put secrets in `NEXT_PUBLIC_` variables** — these are exposed to the browser
- **Tokens use `sessionStorage`** — each browser tab has its own isolated session; closing the tab clears the session
- **Rotate JWT secrets** if compromised — all sessions will be invalidated
- **Rotate SDK tokens** via the dashboard (POST `/projects/:id/token`) if leaked
