# ─────────────────────────────────────────────────────────────────────────────
# Dockerfile — NestJS Production Build
# Multi-stage: build → prune → run (keeps final image lean)
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Build ────────────────────────────────────────────────────────────
FROM oven/bun:1.3 AS builder
WORKDIR /app

# Install deps first (layer cache: only re-runs if package.json changes)
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

# Copy source + generate Prisma client
COPY . .
RUN bunx prisma generate
RUN bun run build

# ── Stage 2: Production image ─────────────────────────────────────────────────
FROM oven/bun:1.3-slim AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copy only what's needed to run
COPY --from=builder /app/dist       ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./
COPY --from=builder /app/src/generated ./src/generated
COPY --from=builder /app/prisma     ./prisma

# Non-root user for security
RUN addgroup --system --gid 1001 nestjs && \
    adduser  --system --uid 1001 nestjs
USER nestjs

EXPOSE 4000

HEALTHCHECK --interval=10s --timeout=5s --start-period=15s --retries=5 \
  CMD wget -qO- http://localhost:4000/health || exit 1

CMD ["bun", "run", "dist/main"]
