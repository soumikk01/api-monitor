# CLI — `apps/cli`

> **Node.js ≥18 · TypeScript · Commander · Socket.io-client · Axios**  
> Published to npm as `api-nest-cli`. Intercepts HTTP calls in user projects and streams them to the API Nest dashboard.

---

## npm Package

```
npm install api-nest-cli
# or
bun add api-nest-cli
```

Package name: `api-nest-cli`  
Binary: `api-nest`

---

## Directory Structure

```
apps/cli/
├── package.json            ← name: "api-nest-cli" (public npm package)
├── tsconfig.json
└── src/
    ├── index.ts            ← CLI entry point (Commander program)
    ├── register.ts         ← Node.js require() hook (monkey-patches http/https)
    ├── config.ts           ← Config file reader/writer (.api-nest.json)
    ├── commands/
    │   └── init.ts         ← `api-nest init` command implementation
    └── interceptor/
        └── (HTTP interceptors)
```

---

## Commands

### `api-nest init`

Initializes API Nest in a user's project.

```bash
api-nest init \
  --token sdk_abc123...       \  # SDK token from dashboard → Get Command
  --project my-project-id    \  # Optional: project ID to associate with
  --backend http://localhost:4000  # Optional: backend URL (default: localhost:4000)
```

What it does:
1. Validates the token against the backend
2. Creates `.api-nest.json` in the project root with config
3. Patches `package.json` to auto-require the interceptor on startup
4. Prints setup instructions

### Using the Interceptor (after init)

The user adds this to their project entry point:

```ts
// At the very top of your app's entry file (e.g. index.ts, server.ts)
import 'api-nest-cli/register';
// or with require:
require('api-nest-cli/register');
```

This monkey-patches Node's `http` and `https` modules (or Axios) to:
1. Capture every outgoing HTTP request + response
2. Send captured events to the backend via `POST /api/v1/ingest/:projectId`

---

## Building

```bash
cd apps/cli
bun run build    # tsc → outputs to dist/
bun run dev      # tsc --watch
```

Outputs:
- `dist/index.js` — CLI binary
- `dist/register.js` — require hook for user projects

---

## Publishing to npm

```bash
cd apps/cli
# Bump version in package.json first
bun run build
npm publish
```

> **Note**: The CLI keeps its public npm name `api-nest-cli` unchanged — it is **not** renamed to `@api-monitor/cli`. This is intentional.

---

## `.api-nest.json` Config File

Created in the user's project root by `api-nest init`:

```json
{
  "token": "sdk_abc123...",
  "projectId": "682abc...",
  "backendUrl": "http://localhost:4000",
  "version": "1.0.9"
}
```

This file is **automatically added to `.gitignore`** by the init command.

---

## Data Flow

```
User's App
   │ (makes HTTP requests)
   ▼
CLI Interceptor (monkey-patch)
   │ captures: method, url, headers, body, statusCode, latency
   ▼
POST /api/v1/ingest/:projectId
  Authorization: Bearer sdk_<token>
   │
   ▼
NestJS Backend → BullMQ queue → Worker → MongoDB + WebSocket
```

---

## Local Development

When testing the CLI against a local backend:

```bash
api-nest init --token sdk_xxx --backend http://localhost:4000
```

The `--backend` flag defaults to `http://localhost:4000` which is the local backend dev port.
