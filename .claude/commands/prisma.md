---
description: Push Prisma schema changes to MongoDB and regenerate client
---

Run from the backend app directory:

```bash
cd apps/backend && npx prisma db push && npx prisma generate
```

Use this after modifying `apps/backend/prisma/schema.prisma`.
Always regenerate the client so TypeScript picks up new fields.
