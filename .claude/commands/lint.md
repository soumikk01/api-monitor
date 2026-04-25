---
description: Run linter across all apps
---

```bash
bun run lint
```

This runs ESLint across all Turborepo apps. Fix all errors before committing.
Common issues to watch for:
- Unused imports/variables
- `prefer-const` rule violations
- Missing `key` props on mapped elements
