# ──────────────────────────────────────────────────────────────────────────────
# Stage 1: deps — install all node_modules using pnpm workspaces
# ──────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS deps

RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

WORKDIR /repo

# Copy workspace manifests only (for layer caching)
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/web/package.json ./apps/web/
COPY packages/design-system/package.json ./packages/design-system/
COPY packages/localization/package.json ./packages/localization/
COPY packages/content-model/package.json ./packages/content-model/
COPY packages/shared-config/package.json ./packages/shared-config/
COPY packages/synthia-core/package.json ./packages/synthia-core/

# Stub out other workspace packages so pnpm graph resolves
RUN for pkg in agent-orchestrator build-engine community-engine graph-engine mcp-server media-pipeline three-engine; do \
      mkdir -p packages/$pkg && echo '{"name":"@kupuri/'$pkg'","version":"0.0.0"}' > packages/$pkg/package.json; \
    done
RUN for svc in blender-worker ingest-worker translation-worker; do \
      mkdir -p services/$svc && echo '{"name":"@kupuri/'$svc'","version":"0.0.0"}' > services/$svc/package.json; \
    done
RUN mkdir -p apps/docs apps/studio apps/mcp-host
RUN echo '{"name":"@kupuri/docs","version":"0.0.0"}' > apps/docs/package.json
RUN echo '{"name":"@kupuri/studio","version":"0.0.0"}' > apps/studio/package.json
RUN echo '{"name":"@kupuri/mcp-host","version":"0.0.0"}' > apps/mcp-host/package.json

RUN pnpm install --frozen-lockfile

# ──────────────────────────────────────────────────────────────────────────────
# Stage 2: builder — build apps/web
# ──────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

WORKDIR /repo

# Copy installed node_modules
COPY --from=deps /repo/node_modules ./node_modules
COPY --from=deps /repo/apps/web/node_modules ./apps/web/node_modules 2>/dev/null || true

# Copy full source
COPY . .

# Build env — only NEXT_PUBLIC_ vars embedded at build time
ARG NEXT_PUBLIC_BASE_URL=http://31.220.58.212:3000
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Generate Prisma client (if schema exists)
RUN if [ -f packages/content-model/prisma/schema.prisma ]; then \
      pnpm --filter @kupuri/content-model exec prisma generate; \
    fi

# Build only the web app
RUN pnpm --filter @kupuri/web build

# ──────────────────────────────────────────────────────────────────────────────
# Stage 3: runner — minimal production image
# ──────────────────────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner

RUN apk add --no-cache libc6-compat

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# Non-root user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy Next.js standalone output
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=nextjs:nodejs /repo/apps/web/public ./apps/web/public

USER nextjs

EXPOSE 3000

CMD ["node", "apps/web/server.js"]
