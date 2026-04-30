# CLI — `apps/cli`

> **Node.js ≥18 · TypeScript · Commander · Socket.io-client · Axios**  
> Published to npm as `apio-cli`. Intercepts HTTP calls in user projects and streams them to the Apio dashboard.

---

## npm Package

```
npm install apio-cli
# or
bun add apio-cli
```

Package name: `apio-cli`  
Binary: `apio`

---

## Directory Structure

```
apps/cli/
├── package.json            ← name: "apio-cli" (public npm package)
├── tsconfig.json
└── src/
    ├── index.ts            ← CLI entry point (Commander program)
    ├── register.ts         ← Node.js require() hook (monkey-patches http/https)
    ├── config.ts           ← Config file reader/writer (.apio.json)
    ├── commands/
    │   └── init.ts         ← `apio init` command implementation
    └── interceptor/
        └── (HTTP interceptors)
```

---

## Commands

### `apio init`

Initializes Apio in a user's project.

```bash
apio init \
  --token sdk_abc123...       \  # SDK token from dashboard → Get Command
  --project my-project-id    \  # Optional: project ID to associate with
  --backend http://localhost:4000  # Optional: backend URL (default: localhost:4000)
```

What it does:
1. Validates the token against the backend
2. Creates `.apio.json` in the project root with config
3. Patches `package.json` to auto-require the interceptor on startup
4. Prints setup instructions

### Using the Interceptor (after init)

The user adds this to their project entry point:

```ts
// At the very top of your app's entry file (e.g. index.ts, server.ts)
import 'apio-cli/register';
// or with require:
require('apio-cli/register');
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

> **Note**: The CLI keeps its public npm name `apio-cli` unchanged — it is **not** renamed to `@api-monitor/cli`. This is intentional.

---

## `.apio.json` Config File

Created in the user's project root by `apio init`:

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
apio init --token sdk_xxx --backend http://localhost:4000
```

The `--backend` flag defaults to `http://localhost:4000` which is the local backend dev port.
