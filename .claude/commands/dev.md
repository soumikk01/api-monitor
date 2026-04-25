---
description: Start all apps in development mode
---

Run the full dev stack:

```bash
bun run dev
```

This starts all Turborepo apps in parallel:
- `apps/web`     → http://localhost:3000 (dashboard)
- `apps/auth`    → http://localhost:3001 (login/register)
- `apps/backend` → http://localhost:4000 (API + WebSocket)
- `apps/docs`    → http://localhost:3002 (docs)
