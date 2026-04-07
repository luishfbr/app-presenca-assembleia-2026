FROM node:20-alpine AS base
RUN corepack enable && corepack prepare pnpm@latest --activate

# ── 1. Install dependencies ──────────────────────────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ── 2. Development runner ─────────────────────────────────────────────────────
FROM base AS dev
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=development
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
CMD ["pnpm", "dev"]

# ── 3. Build ─────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Dummy env vars so Next.js build doesn't fail on missing env validation
ENV DATABASE_URL=postgresql://placeholder:placeholder@localhost:5432/placeholder
ENV BETTER_AUTH_SECRET=placeholder
ENV ENCRYPTION_KEY=0000000000000000000000000000000000000000000000000000000000000000
ENV HMAC_KEY=0000000000000000000000000000000000000000000000000000000000000000
RUN pnpm build

# ── 4. Migrator (roda migrations + seed, depois encerra) ─────────────────────
FROM base AS migrator
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
CMD ["sh", "-c", "pnpm drizzle-kit generate && pnpm drizzle-kit migrate && (pnpm seed || echo 'Seed ignorado: admin já existe')"]

# ── 5. Production runner ──────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

CMD ["node", "server.js"]
