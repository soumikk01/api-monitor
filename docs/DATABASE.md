# Database Schema — `apps/backend/prisma/schema.prisma`

> **Database**: MongoDB Atlas  
> **ORM**: Prisma 6 with `prisma-client-js`  
> **Client output**: `apps/backend/src/generated/prisma/`

---

## Models Overview

```
User
 ├── Project[]           (owns many projects)
 ├── ProjectMember[]     (membership in other projects)
 ├── ApiCall[]           (all API calls attributed to user)
 ├── AlertRule[]         (user-defined alert thresholds)
 └── AuditLog[]          (audit trail of user actions)

Project
 ├── ApiCall[]           (all calls in this project)
 ├── Environment[]       (production/staging/dev/custom)
 ├── AlertRule[]
 ├── AuditLog[]
 └── ProjectMember[]

ApiCall
 ├── Project
 ├── User
 └── Environment?

Environment
 └── ApiCall[]

AlertRule
 ├── Project
 └── User

AuditLog
 ├── User
 └── Project?
```

---

## Model: `User`

| Field | Type | Notes |
|---|---|---|
| `id` | `String` | MongoDB ObjectId, auto-generated |
| `email` | `String` | Unique |
| `password` | `String` | bcrypt hash (cost factor 12) |
| `name` | `String?` | Optional display name |
| `sdkToken` | `String` | Unique — used by CLI to authenticate ingest requests. Format: `sdk_<48 hex chars>` |
| `createdAt` | `DateTime` | Auto |
| `updatedAt` | `DateTime` | Auto |

---

## Model: `Project`

| Field | Type | Notes |
|---|---|---|
| `id` | `String` | ObjectId |
| `name` | `String` | Display name |
| `description` | `String?` | Optional |
| `slug` | `String?` | URL-safe identifier derived from name |
| `userId` | `String` | Owner's user ID |
| `createdAt` | `DateTime` | Auto |
| `updatedAt` | `DateTime` | Auto |

**Indexes**: `[userId]`

---

## Model: `ProjectMember`

Multi-user access control.

| Field | Type | Notes |
|---|---|---|
| `id` | `String` | ObjectId |
| `projectId` | `String` | FK → Project |
| `userId` | `String` | FK → User |
| `role` | `String` | `"OWNER"` \| `"ADMIN"` \| `"MEMBER"` |
| `createdAt` | `DateTime` | Auto |

**Unique constraint**: `[projectId, userId]`

---

## Model: `Environment`

| Field | Type | Notes |
|---|---|---|
| `id` | `String` | ObjectId |
| `name` | `String` | e.g. `"production"` |
| `label` | `String` | Display label, e.g. `"Production"` |
| `color` | `String` | Hex color for UI badge (default `#10b981`) |
| `projectId` | `String` | FK → Project |

**Indexes**: `[projectId]`

---

## Model: `ApiCall`

One record per intercepted HTTP request. This is the **high-volume** model.

### Request fields
| Field | Type | Notes |
|---|---|---|
| `method` | `String` | GET, POST, PUT, PATCH, DELETE (uppercase) |
| `url` | `String` | Full URL |
| `host` | `String` | Extracted hostname |
| `path` | `String` | Extracted pathname |
| `requestHeaders` | `Json?` | Optional |
| `requestBody` | `Json?` | Optional |
| `queryParams` | `Json?` | Optional |

### Response fields
| Field | Type | Notes |
|---|---|---|
| `statusCode` | `Int?` | HTTP status code |
| `statusText` | `String?` | e.g. `"OK"`, `"Not Found"` |
| `responseHeaders` | `Json?` | Optional |
| `responseBody` | `Json?` | Optional |
| `responseSize` | `Int?` | Bytes |

### Timing
| Field | Type | Notes |
|---|---|---|
| `latency` | `Int` | Milliseconds (endedAt - startedAt) |
| `startedAt` | `DateTime` | When request was initiated |
| `endedAt` | `DateTime` | When response was received |

### Classification
| Field | Type | Values |
|---|---|---|
| `status` | `String` | `SUCCESS` \| `CLIENT_ERROR` \| `SERVER_ERROR` \| `PENDING` |

### SDK metadata
| Field | Type | Notes |
|---|---|---|
| `sdkVersion` | `String?` | CLI version that sent this event |
| `hostname` | `String?` | Machine hostname |

**Indexes** (compound — critical for performance):
```
[projectId]
[userId]
[projectId, status]      ← fast error-rate queries
[projectId, createdAt]   ← fast time-range queries
[host]                   ← fast per-host analytics
```

---

## Model: `AlertRule`

User-defined threshold alerts.

| Field | Type | Values/Notes |
|---|---|---|
| `name` | `String` | Display name |
| `metric` | `String` | `"error_rate"` \| `"latency_p95"` \| `"total_calls"` |
| `operator` | `String` | `"gt"` \| `"lt"` \| `"gte"` \| `"lte"` |
| `threshold` | `Float` | The threshold value |
| `windowMin` | `Int` | Rolling window in minutes (default 5) |
| `enabled` | `Boolean` | Whether the rule is active |

---

## Model: `AuditLog`

Tracks user actions on projects for compliance/debugging.

| Field | Type | Example values |
|---|---|---|
| `action` | `String` | `PROJECT_CREATED`, `PROJECT_DELETED`, `TOKEN_REGENERATED` |
| `detail` | `Json?` | `{ "name": "my-api" }` |
| `ipAddress` | `String?` | Client IP |
| `userAgent` | `String?` | Browser/CLI user agent string |

---

## Prisma Commands

```bash
cd apps/backend

# Generate client after schema changes
bun run prisma generate

# Push schema to MongoDB (dev only)
bun run prisma db push

# Open Prisma Studio (GUI browser for your data)
bun run prisma studio

# Check schema validity
bun run prisma validate
```

---

## MongoDB Index Strategy

High-traffic queries and their covering indexes:

| Query | Index Used |
|---|---|
| History by project (paginated) | `[projectId, createdAt]` |
| Error rate calculation | `[projectId, status]` |
| Per-host analytics | `[host]` |
| User's projects list | `[userId]` |
| Windowed stats (last 1h) | `[projectId, createdAt]` |

---

## Notes

- MongoDB uses `_id` (ObjectId) as the primary key. Prisma maps this as `@id @default(auto()) @map("_id") @db.ObjectId`.
- The generated Prisma client is output to `src/generated/prisma/` (gitignored) and must be regenerated after every schema change or fresh clone.
- `.gitignore` includes `**/src/generated/prisma` — never commit generated artifacts.
