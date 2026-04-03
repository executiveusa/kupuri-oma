# Kupuri OMA — Deployment Specification

**Version:** 0.1.0  
**Status:** Phase 0  

---

## 1. Environments

| Environment | Purpose | URL | Deploy trigger |
|---|---|---|---|
| `local` | Developer machines | localhost:3000 | `pnpm dev` |
| `preview` | PR review, feature branches | Auto from Vercel | PR open/push |
| `staging` | Pre-release validation | staging.kupuri.mx | Manual promote |
| `production` | Live users | kupuri.mx | Manual approve gate |

---

## 2. Infrastructure Overview

### apps/web (Next.js)
- **Platform:** Vercel
- **Build command:** `pnpm turbo run build --filter=web`
- **Install command:** `pnpm install --frozen-lockfile`
- **Root directory:** `/apps/web` (or monorepo root with filter)
- **Environment variables:** injected via Vercel project settings (never in repo)

### apps/studio (Next.js) — Phase 3
- **Platform:** Vercel
- **Same pattern as apps/web**

### services/ingest-worker and services/translation-worker
- **Platform:** Railway or Fly.io
- **Build:** Docker (Node.js 20 Alpine)
- **Deploy:** Push to main branch or manual trigger

### packages/mcp-server
- **Mode 1:** `npx @kupuri/mcp-server` (local stdio, per-user)  
- **Mode 2:** Hosted HTTP server (Phase 3, Railway)

### Database
- **PostgreSQL:** Railway or Supabase (LATAM region selected)
- **Neo4j:** Neo4j Aura (free tier → dedicated for production)

---

## 3. Environment Variables

**NEVER commit these.** All secrets via Vercel / Railway / Infisical.

### Required for apps/web
```
DATABASE_URL                    PostgreSQL connection string
NEO4J_URI                       Neo4j connection URI
NEO4J_USERNAME                  Neo4j username
NEO4J_PASSWORD                  Neo4j password
NEXTAUTH_URL                    App URL (https://kupuri.mx)
NEXTAUTH_SECRET                 Random 64-char secret
GOOGLE_CLIENT_ID                OAuth (optional)
GOOGLE_CLIENT_SECRET            OAuth (optional)
NEXT_PUBLIC_APP_URL             Public URL for client-side use
```

### Required for services
```
DATABASE_URL                    Same PostgreSQL
DEEPL_API_KEY                   Translation
OPENAI_API_KEY                  AI operations
INGEST_WORKER_BATCH_SIZE        50
INGEST_WORKER_QUALITY_THRESHOLD 0.7
TRANSLATION_QA_THRESHOLD        0.90
```

### Optional (Phase 3+)
```
STRIPE_SECRET_KEY               Billing
STRIPE_WEBHOOK_SECRET           Stripe webhooks
STRIPE_PUBLISHABLE_KEY          Client-side
S3_BUCKET_NAME                  Asset storage
S3_REGION                       AWS region (prefer South America)
CLOUDFRONT_DISTRIBUTION_ID      CDN invalidation
```

---

## 4. CI/CD GitHub Actions

### Workflow: `ci.yml` (runs on every PR and push)
1. Install dependencies (`pnpm install --frozen-lockfile`)
2. Type check (`pnpm turbo run typecheck`)
3. Lint (`pnpm turbo run lint`)
4. Unit tests (`pnpm turbo run test`)
5. Build (`pnpm turbo run build`)

### Workflow: `preview.yml` (runs on PR open/sync)
1. All CI steps
2. Deploy preview to Vercel
3. Comment PR with preview URL

### Workflow: `deploy-production.yml` (manual only)
1. Requires: CI green, staging validation passed
2. Requires: Manual approval in GitHub Actions
3. Deploy to Vercel production
4. Run DB migration if pending
5. Slack notification

---

## 5. Rollback Procedure

### Application rollback
1. Go to Vercel dashboard → Deployments
2. Find last known-good deployment
3. Click "Promote to Production"
4. Verify health endpoint: `GET /api/health`

### Database rollback  
1. Never run `prisma migrate reset` in production (destructive)
2. Use `prisma migrate diff` to view pending changes
3. Write a down-migration `.sql` file manually if needed
4. Run via Prisma `db execute` with the down migration

### Emergency procedure
1. Toggle maintenance mode on (Vercel environment variable `MAINTENANCE_MODE=true`)
2. Notify users via status page
3. Begin rollback procedure
4. Verify all critical paths
5. Toggle maintenance mode off

---

## 6. Health Checks

### API health endpoint
`GET /api/health` returns:
```json
{
  "status": "ok",
  "timestamp": "2025-01-15T10:00:00.000Z",
  "version": "0.1.0",
  "services": {
    "db": "ok",
    "neo4j": "ok"
  }
}
```

Error response (503):
```json
{
  "status": "degraded",
  "services": { "db": "error", "neo4j": "ok" }
}
```

---

## 7. Release Checklist

Before promoting any deployment from preview → staging → production:

### Preview → Staging
- [ ] All CI checks green
- [ ] TypeScript 0 errors
- [ ] Architecture score ≥ 8.5
- [ ] Design audit score ≥ 8.5
- [ ] es-MX localization coverage ≥ 90%
- [ ] Preview URL manually smoke-tested
- [ ] No new secrets exposed (git-secrets scan)

### Staging → Production
- [ ] All staging checklist items above
- [ ] Load test run (basic)
- [ ] DB migration reviewed and runbook written
- [ ] Rollback plan documented
- [ ] Manual approval in GitHub Actions
- [ ] Monitoring alerts configured
- [ ] Status page updated
