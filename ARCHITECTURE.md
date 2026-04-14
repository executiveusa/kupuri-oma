# ARCHITECTURE.MD — PAULI CINEMATIC STUDIO™

**Governance**: EMERALD TABLETS™ | **Quality Floor**: UDEC 8.5/10  
**Analysis Framework**: Donella Meadows — Thinking in Systems

---

## System Overview

PAULI CINEMATIC STUDIO™ is a multi-niche video generation platform built on the kupuri-oma monorepo. One backend serves six product niches: three active (Fashion, Spa, Ecotourism) and three invite-only (Education, Anime, Game Dev).

---

## Meadows Systems Analysis

### Stocks (what accumulates)

| Stock | Location | Units |
|---|---|---|
| Characters | `cinema_characters` table | Count per user per niche |
| Videos | `cinema_videos` table | Count, storage bytes |
| Affiliate commissions | `cinema_affiliate_commissions` | USD |
| User trust | Waitlist + subscription | Users |
| GPU cost budget | Cost tracker | USD / day |
| Quality reputation | Average UDEC scores | 0–10 score |

### Flows (what changes stocks)

| Flow | Direction | Rate |
|---|---|---|
| Character creation | +characters | ~2/day per active user |
| Video generation | +videos | ~5/day per active creator |
| Affiliate clicks | +commissions (pending) | Continuous |
| Affiliate conversions | +commissions (approved) | ~2-8% of clicks |
| GPU cost spend | +cost_budget_used | ~$3.10/video |
| UDEC scoring | +/- quality reputation | Per video |

### Feedback Loops

**Balancing loop (QUALITY GATE):**
```
Video generated → UDEC score calculated →
If score < 8.5 → reject + regenerate →
Reduces low-quality video stock
```

**Balancing loop (COST GUARD):**
```
Cost per job estimated → Compare to $5 limit →
If exceeds → halt request →
Keeps GPU cost budget from overflowing
```

**Reinforcing loop (AFFILIATE ENGINE):**
```
Videos created → Affiliate links embedded →
Clicks drive conversions → Commission earned →
Creator earns more → Creates more videos
```

### Leverage Points

- **LP4 (Information flows)**: UDEC quality scores surfaced to users in real-time prevent low-quality content from accumulating
- **LP3 (Goals)**: Setting UDEC minimum at 8.5 (not 7.0) shifts the whole system toward cinematic output
- **LP2 (Paradigm)**: Treating all 6 niches as ONE product (different UI, same backend) prevents code divergence

---

## Data Flow: Video Generation Pipeline

```
User submits prompt + character_id
          │
          ▼
POST /api/cinema/generate
  ├─ Validate schema (Zod)
  ├─ COST_GUARD: estimate $3.10, block if > $5
  ├─ Enqueue job in Redis
  └─ Return { job_id, status: 'queued', estimated_cost }
          │
          ▼
Modal.com GPU Worker (Python)
  ├─ Load character embedding from Supabase (pgvector)
  ├─ FLUX.2: Generate keyframe ($0.50, ~45s)
  ├─ Kling 3.0: Generate 15s video ($2.00, ~8min)
  ├─ Higgsfield API: Enforce character consistency ($0.30)
  ├─ FFmpeg: Apply color grade ($0.10, ~30s)
  └─ UDEC Scorer: Score all 14 axes ($0.20)
          │
          ▼
Quality Gate
  ├─ If any axis < 8.0 → reject + retry (max 3x)
  ├─ If overall < 8.5 → hold for manual review
  └─ If pass → store in Cloudflare R2, update Supabase
          │
          ▼
Client polls GET /api/cinema/generate/:jobId
  └─ Returns { status, progress, quality_score, video_url }
```

---

## Service Topology

```
┌─────────────────────────────────────────────────────────┐
│                    Vercel Edge (CDN)                     │
├──────────────────┬──────────────────┬────────────────────┤
│  apps/web        │  apps/studio     │  apps/mcp-host     │
│  Marketing site  │  Creator studio  │  MCP API host      │
│  (Next.js 15)    │  (Next.js 15)    │  (Next.js 15)      │
└──────────────────┴──────────┬───────┴────────────────────┘
                               │ API calls
              ┌────────────────▼────────────────┐
              │  Vercel Functions / API Routes   │
              │  /api/cinema/*                   │
              └────┬──────────┬─────────┬────────┘
                   │          │         │
          ┌────────▼─┐  ┌─────▼──┐  ┌──▼──────┐
          │ Supabase │  │ Neo4j  │  │  Redis  │
          │ Postgres │  │ AuraDB │  │ Upstash │
          │ +pgvector│  │ (graph)│  │ (queue) │
          └────┬─────┘  └────────┘  └──┬──────┘
               │                        │
               │                 ┌──────▼──────────┐
               │                 │  Modal.com GPU   │
               │                 │  FLUX.2 + Kling  │
               │                 │  Higgsfield API  │
               │                 └──────┬───────────┘
               │                        │
          ┌────▼─────────────────────────▼──────┐
          │         Cloudflare R2 (assets)       │
          │  /fashion/* /spa/* /ecotourism/*     │
          └─────────────────────────────────────┘
```

---

## Package Structure

```
kupuri-oma/
├── apps/
│   ├── studio/          Next.js 15 — Creator dashboard
│   │   └── src/app/
│   │       ├── [locale]/dashboard/cinema/     ← NEW
│   │       │   ├── page.tsx                   Cinema hub
│   │       │   ├── fashion/page.tsx            Active niche
│   │       │   ├── spa/page.tsx                Active niche
│   │       │   ├── ecotourism/page.tsx         Active niche
│   │       │   ├── education/page.tsx          → redirect coming-soon
│   │       │   ├── anime/page.tsx              → redirect coming-soon
│   │       │   ├── game-dev/page.tsx           → redirect coming-soon
│   │       │   └── coming-soon/page.tsx        Invite Only page
│   │       └── api/cinema/                    ← NEW
│   │           ├── characters/route.ts
│   │           ├── generate/route.ts
│   │           ├── generate/[jobId]/route.ts
│   │           ├── affiliate/links/route.ts
│   │           ├── affiliate/stats/route.ts
│   │           ├── affiliate/webhook/route.ts
│   │           └── waitlist/route.ts
│   └── web/             Next.js 15 — Marketing site
│
├── packages/
│   ├── content-model/   Prisma schema + migrations
│   │   └── migrations/001_cinema_schema.sql   ← NEW
│   ├── design-system/   Shared UI (Card, Button, Badge)
│   ├── localization/    i18n (es-MX, en)
│   └── synthia-core/    Quality scoring (UDEC)
│
├── AGENT.md             ← NEW — Mandatory reading
├── RALPHY.md            ← NEW — Design rules
└── ARCHITECTURE.md      ← This file
```

---

## API Contract

### Characters
```
POST /api/cinema/characters
  Body: { name, description, niche, photos[], style? }
  Returns: { data: Character }

GET /api/cinema/characters?niche=fashion&page=1
  Returns: { data: Character[], page, limit, total }
```

### Video Generation
```
POST /api/cinema/generate
  Body: { character_id, niche, prompt, duration_seconds?, motion_type?, color_grade? }
  Returns: { data: { id, status: 'queued', estimated_cost_usd, estimated_minutes } }
  Status: 202

GET /api/cinema/generate/:jobId
  Returns: { data: { status, progress, quality_score, video_url } }
```

### Affiliate
```
POST /api/cinema/affiliate/links
  Body: { platform, product_id, niche, video_id? }
  Returns: { data: { tracking_url, commission_rate } }

GET /api/cinema/affiliate/stats?niche=fashion
  Returns: { data: { clicks, conversions, earnings_usd, pending_usd } }

POST /api/cinema/affiliate/webhook
  Headers: x-pauli-webhook-signature
  Body: { platform, event, tracking_id, amount_usd? }
  Returns: { data: { commission_usd, creator_earnings_usd } }
```

### Waitlist (Coming Soon Niches)
```
POST /api/cinema/waitlist
  Body: { email, niche: 'education' | 'anime' | 'game-dev' }
  Returns: { data: { id, position, joined_at } }
```

---

## Security Model

- All API inputs validated with Zod before processing
- Affiliate webhooks require `x-pauli-webhook-signature` header
- Environment secrets via `process.env.*` — never hardcoded
- Circuit breakers prevent cost overruns (single job > $5 → 402)
- Rate limiting: enforce at Vercel Edge (100 req/min per IP)
- CORS: allow only `*.pauli.app` origins on production

---

## Circuit Breakers

| Guard | Trigger | Action |
|---|---|---|
| COST_GUARD | Single job > $5 | Return 402, log |
| COST_GUARD_DAILY | User daily > $100 | Return 402, send alert |
| SECRET_GUARD | Secret in output | Halt, scrub, log |
| LOOP_GUARD | Same error 3× | Halt, escalate |
| BLAST_RADIUS | > 3 services | Require ACK |
| PRODUCTION_GATE | Deploy to prod | Require ACK |
| IRREVERSIBILITY | DB drop / force push | HALT |

---

## Quality Gate (UDEC 14 Axes)

All generated videos scored on:
1. Cinematic quality
2. Character consistency
3. Color accuracy
4. Audio sync
5. Text readability
6. Pacing / rhythm
7. Motion smoothness
8. Lighting quality
9. Composition
10. Focus / depth
11. Emotional impact (niche-specific)
12. Brand alignment
13. Accessibility (captions, contrast)
14. Performance (loading time)

**Minimum**: 8.5 overall, 8.0 per axis. Below threshold → regenerate (max 3 retries).
