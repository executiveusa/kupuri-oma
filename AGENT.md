# AGENT.MD — MANDATORY READING FOR ALL MODELS

**Read this completely before writing any code.**

---

## THE MANDATE

You are building **PAULI CINEMATIC STUDIO™** — a production-grade platform that converts character designs into cinematic videos, serving three active niches from a single backend:

1. **Fashion & E-commerce** — UGC creators, clothing brands, product marketing (Mexico City focus)
2. **Spa & Massage Therapy** — Service businesses, wellness practitioners, appointment marketing
3. **Ecotourism & Nature** — Tour operators, eco-resorts, destination marketing

Three more niches are designed and ready to activate (Education, Anime, Game Dev) — they show a "Coming Soon / Invite Only" page until launched.

**One backend. Six frontend slots. Three active. Three invite-only.**

---

## CORE PRINCIPLES (NON-NEGOTIABLE)

### 1. EMERALD TABLETS™ GOVERNANCE
- Every file, every commit is governed by EMERALD TABLETS™
- Quality floor: **UDEC 8.5/10** across all 14 axes
- Zero compromises.

### 2. ZERO-STUB ENFORCEMENT (ZTE PROTOCOL)
- No TODO, FIXME, mock, stub, or placeholder code
- All API calls are **REAL**
- All databases are **CONNECTED**
- All tests **PASS** with 80%+ coverage minimum

Quality gates (run before EVERY commit):
```bash
tsc --noEmit
eslint .
pnpm test
./scripts/stub-detector.sh
./scripts/quality-check.sh
./scripts/secret-scanner.sh
```

### 3. RALPHY DESIGN RULES
- No barrel files — import directly from source
- No god classes — single responsibility per handler
- No monolithic deploys — each service deploys independently
- No hardcoded secrets — use environment variables via vault
- No .env in git — stays in .gitignore

### 4. SYNTHIA™ SYSTEMS THINKING
Map stocks, flows, and feedback loops before coding. Identify leverage points. Enforce quality gates as balancing loops.

### 5. MULTI-NICHE ARCHITECTURE
- ONE backend serves all frontends
- Shared code: 80% (API, auth, storage, quality gates, affiliate layer)
- Niche-specific code: 20% (UI, presets, affiliate integrations)
- No cross-niche contamination

---

## TECHNOLOGY STACK

| Layer | Technology |
|---|---|
| Frontend | Next.js 15 + TypeScript + Tailwind CSS |
| Package manager | pnpm + Turborepo |
| i18n | next-intl (es-MX default, en secondary) |
| Database | Supabase (PostgreSQL + pgvector) |
| Graph | Neo4j 5 |
| GPU inference | Modal.com (FLUX.2 + Kling 3.0) |
| Character consistency | Higgsfield API |
| Asset storage | Cloudflare R2 |
| Job queue | Redis (Upstash) |
| Secrets | Infisical vault |
| Payments | Stripe |
| Monitoring | Sentry + Vercel Analytics |

---

## DESIGN TOKENS (SOUL.md)

- Font: Plus Jakarta Sans only
- Colors: oklch() for all definitions
- Border radius: max rounded-xl (cards), rounded-lg (buttons)
- Spacing: 4/8/12/16/24/32/48/64/96px only
- No glassmorphism, no gradient text, no bounce animations
- LANDING mode: variance=7, motion=5, density=3
- COCKPIT mode: variance=3, motion=2, density=8

---

## NICHE CONFIGURATION

```typescript
export const NICHES = {
  fashion:    { active: true,  path: 'fashion',    affiliates: ['shopify', 'amazon', 'zalora'] },
  spa:        { active: true,  path: 'spa',         affiliates: ['treatwell', 'booksy'] },
  ecotourism: { active: true,  path: 'ecotourism', affiliates: ['booking_com', 'airbnb'] },
  education:  { active: false, path: 'education',  affiliates: ['udemy', 'skillshare'] },
  anime:      { active: false, path: 'anime',       affiliates: ['patreon', 'gumroad'] },
  game_dev:   { active: false, path: 'game-dev',   affiliates: ['unity', 'unreal'] },
} as const
```

Inactive niches render the Coming Soon / Invite Only page.

---

## API SURFACE

```
POST /api/cinema/characters          Create character with embedding
GET  /api/cinema/characters          List user's characters
GET  /api/cinema/characters/:id      Get character by ID
DELETE /api/cinema/characters/:id    Delete character

POST /api/cinema/generate            Start video generation job
GET  /api/cinema/generate/:jobId     Poll job status
GET  /api/cinema/videos              List user's videos

GET  /api/cinema/affiliate/links     Generate affiliate tracking links
GET  /api/cinema/affiliate/stats     Commission stats by niche/platform
POST /api/cinema/affiliate/webhook   Receive affiliate conversion events

GET  /api/cinema/quality/:videoId    Get UDEC score for video
```

---

## COST BUDGET (PER VIDEO)

| Step | Service | Cost |
|---|---|---|
| Keyframe (FLUX.2) | Modal.com A40 | $0.50 |
| Video (Kling 3.0, 15s) | Modal.com A40 | $2.00 |
| Character consistency | Higgsfield API | $0.30 |
| Color grading | FFmpeg | $0.10 |
| UDEC scoring | Inference | $0.20 |
| **Total** | | **~$3.10** |

Circuit breakers:
- Single video > $5 → HALT
- User daily > $100 → HALT
- 3 consecutive failures → HALT + escalate

---

## AFFILIATE RATES

| Niche | Platform | Rate | Trigger |
|---|---|---|---|
| Fashion | Shopify | 5% | Product sale |
| Fashion | Amazon | 4% | Product sale |
| Spa | Treatwell | 12% | Appointment booked |
| Spa | Booksy | 10% | Appointment booked |
| Ecotourism | Booking.com | 5% | Tour booked |
| Ecotourism | Airbnb | 4% | Experience booked |

Revenue split: Creator 70% / Platform 30%.

---

## CIRCUIT BREAKERS (HARDCODED)

- **COST_GUARD**: Single task > $10 or daily > $50 → HALT
- **SECRET_GUARD**: Secret pattern in output → HALT, scrub
- **LOOP_GUARD**: Same error 3× → HALT, escalate
- **BLAST_RADIUS_GUARD**: > 3 services in one run → REQUIRE_ACK
- **PRODUCTION_GATE**: Deploy to production → REQUIRE_ACK
- **IRREVERSIBILITY_GUARD**: DB drops, force pushes → HALT

---

## TESTING REQUIREMENTS

- Unit: 60% coverage (embedding, cost, scoring, commission)
- Integration: 20% coverage (API endpoints, database, webhooks)
- E2E: 80%+ coverage (complete workflows per niche)
- Quality gate: UDEC ≥8.5 on all video outputs

---

This is the law. Read it. Build by it.
