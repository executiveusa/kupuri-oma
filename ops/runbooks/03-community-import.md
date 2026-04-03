# Kupuri OMA — Community Import Runbook

## Overview

This runbook covers importing legacy AMA/Omma community projects into the new platform.
The ingest-worker CLI handles all phases.

---

## Phase 1 — Raw snapshot

```bash
cd services/ingest-worker

# Run full import from community JSON seed
pnpm dev --input content/community-seed/projects.json --output ops/reports/

# Expected output:
# ✅ Imported 6 projects
# ops/reports/ingest_{timestamp}.json written
```

---

## Phase 2 — Translation sweep

```bash
cd services/translation-worker

# Process all untranslated projects
pnpm dev --locale es-MX --qa-threshold 90

# Check output
cat ops/reports/translation_{timestamp}.json
```

---

## Phase 3 — Graph indexing

After import and translation:

```bash
# Run graph seed (requires NEO4J_URI env var)
cd packages/graph-engine
npx tsx src/seed.ts
```

---

## Validation checklist

```
[ ] All projects appear in /es-MX/community feed
[ ] Each project has es-MX and en translations
[ ] Graph nodes created for industry + vibe tags
[ ] Remix button functional on each project
[ ] SYNTHIA quality scores written to DB
[ ] Thumbnail images generated (media-pipeline)
```

---

## Rollback

If import fails mid-way:

```bash
# Check ops/reports/ingest_*.json for partial state
# Re-run with --resume flag (reads last checkpoint)
pnpm dev --resume --input content/community-seed/projects.json
```

Delete partially imported records:

```sql
-- Only if full re-import is needed
DELETE FROM "CommunityPost" WHERE "importedFrom" = 'legacy-seed';
DELETE FROM "Project" WHERE "sourceRepoRef" = 'legacy-community';
```
