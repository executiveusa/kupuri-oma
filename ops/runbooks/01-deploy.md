# Kupuri OMA — Deploy Runbook

## Overview

This runbook covers all deployment scenarios: preview, staging, and production.  
All deploys are gated by CI. Production requires an explicit operator ACK.

---

## Environments

| Environment | URL | Trigger |
|---|---|---|
| Local | `localhost:3000` | `pnpm dev` |
| Preview | Auto-generated Vercel URL | PR open/sync |
| Staging | `staging.kupuri.mx` | Merge to `main` |
| Production | `kupuri.mx` | Manual workflow dispatch |

---

## Pre-deploy checklist

```
[ ] All CI checks passing (lint, typecheck, test, build)
[ ] Localization coverage >= 90% (check-l10n-coverage.mjs)
[ ] SYNTHIA score >= 8.5 (oma_score_architecture MCP tool)
[ ] No secrets in diff (SECRET_GUARD scan clean)
[ ] Rollback path documented (previous deploy URL noted)
[ ] DB migration is backward-compatible OR feature flag applied
```

---

## Preview deploy

Automatic on PR open/sync via `.github/workflows/preview.yml`.

```bash
# Manual local preview
pnpm build
pnpm start
```

---

## Staging deploy

Triggered automatically when PR merges to `main`.

Monitor: `.github/workflows/deploy-production.yml` (staging step)

Verify:
```bash
curl https://staging.kupuri.mx/health
# Expected: {"ok":true}
```

---

## Production deploy

**Requires manual dispatch.**

1. Go to GitHub → Actions → `deploy-production.yml`
2. Click **Run workflow**
3. Enter confirmation string: `deploy-to-production`
4. Monitor workflow run

Post-deploy smoke test:
```bash
curl https://kupuri.mx/api/health
curl -H "Accept-Language: es-MX" https://kupuri.mx/es-MX/
```

---

## Rollback procedure

```bash
# Using Vercel alias rollback
vercel rollback --scope the-pauli-effect

# Or redeploy previous tag
git checkout <previous-tag>
pnpm install
pnpm build
# redeploy via CI
```

---

## Blender worker deploy (GPU node)

```bash
# On GPU server
cd services/blender-worker
BLENDER_BIN=/usr/bin/blender PORT=4001 tsx src/server.ts

# Health check
curl http://localhost:4001/health
```

---

## Worker deploys (ingest, translation)

```bash
# Ingest worker
cd services/ingest-worker
pnpm dev  # or start

# Translation worker
cd services/translation-worker
pnpm dev
```

---

## ZTE circuit breakers — manual override

In an emergency where BLAST_RADIUS_GUARD blocks a legitimate multi-service deploy:

1. Create a Bead task with `riskTier: 'HIGH'`
2. Document the override reasoning in `ops/reports/{beadId}_override.json`
3. Set `hasProductionApproval: true` in the RunContext
4. Alert the team via notification channel
