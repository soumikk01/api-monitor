# Docs App — `apps/docs`

> **Next.js 16 · React 19 · TypeScript · SCSS Modules**  
> Documentation site. Served at `http://localhost:3002`.

---

## Local URL

```
http://localhost:3002
```

---

## Why a Separate App?

The docs site is:
- **Statically exportable** — can be deployed to GitHub Pages or Cloudflare Pages at zero cost
- **No auth required** — completely public, no JWT, no API calls
- **Independent cache** — changing docs never triggers a rebuild of the dashboard or auth app
- **SEO-optimized** — server-side rendered with full meta tags

---

## Directory Structure

```
apps/docs/
├── next.config.ts
├── tsconfig.json
└── src/
    └── app/
        ├── layout.tsx              ← Minimal layout (no sidebar, no navbar)
        ├── page.tsx                ← Documentation content (/)
        └── _components/
            ├── DocsPage.tsx        ← Main docs component (extracted from apps/web)
            └── Docs.module.scss    ← Docs-specific styles
```

---

## Environment Variables

None required. The docs app is fully static and makes no API calls.

---

## Running Locally

```bash
# From repo root
bun turbo dev --filter=@api-monitor/docs

# Or from apps/docs directly
cd apps/docs
bun run dev      # starts on http://localhost:3002
```

---

## Building

```bash
cd apps/docs
bun run build    # Next.js production build
```

For **static export** (no Node.js server needed):

```ts
// apps/docs/next.config.ts
const nextConfig = {
  output: 'export',   // Generates static HTML in out/
};
```

---

## Content Structure

The docs page covers:

1. **Overview** — What Apio is, key features
2. **Quick Start** — Install CLI, run `apio init`
3. **Architecture** — System diagram, data flow
4. **API Reference** — REST endpoints, WebSocket events
5. **CLI Reference** — All commands and flags
6. **Security** — JWT flow, SDK tokens, CORS
7. **Self-Hosting** — Docker Compose setup

---

## Adding New Docs Pages

Create a new route:

```
apps/docs/src/app/
├── page.tsx              ← Main page (/)
├── api-reference/
│   └── page.tsx          ← /api-reference
├── quickstart/
│   └── page.tsx          ← /quickstart
└── architecture/
    └── page.tsx          ← /architecture
```

---

## Package Dependencies

```json
{
  "dependencies": {
    "next": "16.2.2",
    "react": "19.2.4",
    "react-dom": "19.2.4"
  }
}
```

Minimal — no backend calls, no auth, no socket.
