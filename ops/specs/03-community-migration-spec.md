# Kupuri OMA — Community Migration Specification

**Version:** 0.1.0  
**Status:** Phase 2  

---

## 1. Overview

The community migration pipeline ingests, normalizes, quality-scores, and publishes
legacy community content (from Beehance, Awwwards, other scraping sources) into
the Kupuri OMA community layer.

This is NOT a one-time import — it runs continuously as a background service.

---

## 2. Ingestion Phases

### Phase A — Raw import
- Source: JSON files from scraper output, CSV exports, API responses
- Location: `ops/imports/raw/` (gitignored)
- Worker: `services/ingest-worker`
- Output: `ops/reports/ingest_<batchId>.json`

### Phase B — Normalization
- Run by `packages/community-engine/src/import.ts`
- Schema validation: `RawCommunityItemSchema` (Zod)
- Fields: id, title, description, tags[], thumbnailUrl, authorHandle, sourceUrl, createdAt, sourceQuality (0-1)
- Quality scoring heuristic: title+description+thumbnail+tags+author

### Phase C — Enrichment
- Run by `IngestAgent` (Phase 3)
- Adds: industry classification, vibe tags, motion patterns
- Writes to: graph (Project node + edges)
- Human review gate: LOW quality items enter moderation queue

### Phase D — Publication
- Human review queue: all items with quality < 0.7
- Auto-approve: items with quality ≥ 0.7 + valid schema
- Moderation states: PENDING → APPROVED / REJECTED / FLAGGED

---

## 3. Raw Item Schema

```typescript
RawCommunityItemSchema = z.object({
  id: z.string(),
  title: z.string().min(3).max(100),
  description: z.string().optional(),
  tags: z.array(z.string()).max(20).default([]),
  thumbnailUrl: z.string().url().optional(),
  authorHandle: z.string().optional(),
  sourceUrl: z.string().url(),
  createdAt: z.string().datetime().optional(),
  sourceQuality: z.number().min(0).max(1).default(0.5),
})
```

---

## 4. Quality Scoring

```
score = 0
if title.length >= 10: +2
if description.length >= 50: +2
if thumbnailUrl present and validated: +2
if tags.length >= 3: +2
if authorHandle present: +1
if sourceQuality >= 0.7: +1
total = score / 10  (0.0 – 1.0)
```

**Thresholds:**
- ≥ 0.7 → auto-approve
- 0.4–0.69 → human review queue
- < 0.4 → auto-reject (with log)

---

## 5. Remix Model

### Remix lineage
Every project created from a remix stores:
- `parentId` (original project ID)
- `remixedAt` (timestamp)
- `remixNote` (optional user note)
- `remixDepth` (gen 1, 2, 3...)

### Graph representation
```cypher
(:Project {id: $remixId})-[:REMIXES {at: $timestamp, depth: $depth}]->(:Project {id: $parentId})
```

### Remix rules
- User cannot remix their own project (creates circular lineage)
- Projects with `LICENSED` status cannot be remixed without permission
- Remix credits original author in all views
- `remixDepth` capped at 10 (prevents infinite chains)

---

## 6. Import Report Format

The ingest worker outputs JSON reports:

```json
{
  "batchId": "batch_abc123",
  "sourceFile": "raw_imports_2025-01.json",
  "executedAt": "2025-01-15T10:30:00.000Z",
  "totalItems": 142,
  "approved": 89,
  "queued": 38,
  "rejected": 15,
  "errors": [],
  "items": [
    {
      "rawId": "src_001",
      "normalizedId": "norm_abcdef123",
      "title": "Landing Page Animada",
      "finalScore": 0.82,
      "status": "approved",
      "tags": ["landing", "animacion", "saas"],
      "issues": []
    }
  ]
}
```

---

## 7. Data Governance

- PII scan before publish (email, phone, personal name detection)
- Copyright check: flag if source contains stock photo watermarks
- Content moderation: OpenAI Moderation API on title + description
- Attribution: sourceUrl always preserved and linked
- GDPR/LATAM data: primary storage in regional PostgreSQL
- Retention: rejected items deleted after 90 days

---

## 8. Community Feed Sorting

```typescript
// Available sort strategies
type FeedSort = 
  | 'newest'     // createdAt DESC
  | 'trending'   // remixCount * 3 + likeCount DESC (7d window)
  | 'quality'    // qualityScore DESC
  | 'remixed'    // remixCount DESC

// Default for unauthenticated: trending
// Default for authenticated: personalized (graph-similarity to user projects)
```

---

## 9. Worker Configuration

```
INGEST_WORKER_BATCH_SIZE=50        # Max items per batch
INGEST_WORKER_QUALITY_THRESHOLD=0.7  # Auto-approve threshold
INGEST_WORKER_CONCURRENCY=4        # Parallel normalizations
TRANSLATION_QA_THRESHOLD=0.9       # Warning threshold for coverage
COMMUNITY_MODERATION_ENABLED=true  # Enable OpenAI content check
```
