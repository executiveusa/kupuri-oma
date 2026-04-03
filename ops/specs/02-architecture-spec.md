# Kupuri OMA LATAM — Master Architecture Specification

**Version:** 0.1.0  
**Status:** Phase 0 — Foundation  
**Primary locale:** es-MX  
**Target market:** México / LATAM  

---

## 1. System Overview

Kupuri OMA is a bilingual, premium, Latin America-first design studio platform.

### Core capabilities
- Community discovery with remixable projects
- AI-agent-driven prompt-to-site generation
- Cinematic marketing pages with 3D support
- MCP/API/CLI-triggered workflows
- Graph-backed knowledge layer (Neo4j)
- Bilingual UX — Spanish (México) primary, English secondary

### Non-negotiables
1. One monorepo, one design system, one graph layer
2. Spanish (es-MX) as default locale everywhere
3. MXN as default currency
4. Architecture scores ≥ 8.5 (SYNTHIA gate) required before release
5. No secrets in code or prompts
6. All releases pass the quality gate checklist (section 9)

---

## 2. Monorepo Package Map

```
kupuri-oma/
  apps/
    web/            Next.js 15 — marketing site + auth + dashboard
    studio/         Next.js 15 — authenticated builder workspace (Phase 3+)
    mcp-host/       Inline preview host — ext-apps pattern (Phase 3+)
    docs/           Ops + internal documentation portal (Phase 5)
  packages/
    design-system/  Tokens, components, motion, cn()
    content-model/  Prisma schema + type exports
    graph-engine/   Neo4j driver + query helpers
    community-engine/ Feed, remix, import logic
    mcp-server/     MCP tools exposed to CLI/API/agent hosts
    localization/   es-MX + en messages, formatters, config
    shared-config/  ESLint, tsconfig, env schemas (Zod)
    agent-orchestrator/ (Phase 3) Task DAG planner + execution
    synthia-core/   (Phase 4) Architecture scoring, audit, gates
    build-engine/   (Phase 3) Prompt-to-site pipeline
    three-engine/   (Phase 4) model-viewer + Three.js integration
    media-pipeline/ (Phase 4) Asset processing, thumbnails
  services/
    ingest-worker/  Community scrape + normalize pipeline
    translation-worker/ Translation + QA jobs
    blender-worker/ (Phase 4) 3D generation
  content/
    community-seed/ Seed project JSON files
    pricing/        Pricing data (MXN)
    copy/           Marketing copy (es-MX)
    templates/      Template definitions
  ops/
    specs/          Architecture and domain specs
    prompts/        Agent prompts and constitutions
    reports/        Machine-readable run reports (auto-generated)
    runbooks/       Operational playbooks
  scripts/          Build, seed, migration scripts
  tests/            E2E and integration tests
```

---

## 3. Technology Decisions

| Concern | Choice | Reason |
|---|---|---|
| Frontend framework | Next.js 15 App Router | Standard for LATAM market, SSR for SEO |
| Type system | TypeScript strict | Safety required for agent-modified code |
| Styling | Tailwind CSS v3 + CSS vars | Design token integration |
| i18n | next-intl + @kupuri/localization | App Router native, locale routing |
| Database | PostgreSQL via Prisma | Relational for users/billing/content |
| Graph DB | Neo4j | Relationships, remix lineage, vibe search |
| Auth | NextAuth v5 | LATAM-compatible, extensible |
| Monorepo | pnpm workspaces + Turborepo | Performance, caching |
| MCP | @modelcontextprotocol/sdk | Agent interoperability |
| Design system | Custom (Emerald Tablet) | Precise, not AI-default |

---

## 4. Data Flow Overview

```
User/Agent
  → Next.js App Router (web)
  → NextAuth session middleware
  → API route handlers
  → Prisma (PostgreSQL) — CRUD
  → Neo4j (graph) — relationships + search
  → Agent Orchestrator — build runs + tasks
  → Ingest/Translation workers — background jobs
  → MCP Server — agent tool bridge
```

---

## 5. Graph Node/Edge Schema

### Nodes
`Project`, `Template`, `Component`, `MotionPattern`, `ColorSystem`,
`Industry`, `Locale`, `Asset`, `Prompt`, `BuildRun`, `CommunityPost`,
`QualityScore`, `AgentTask`, `User`, `Vibe`

### Edges
`USES`, `REMIXES`, `TRANSLATES_TO`, `INSPIRED_BY`, `BELONGS_TO_INDUSTRY`,
`SHARES_MOTION_FAMILY`, `MATCHES_VIBE`, `PRODUCED_BY`, `VERIFIED_BY`,
`SUPERSEDES`, `AUTHORED_BY`, `TAGGED_WITH`

---

## 6. Localization Rules

- **Primary:** es-MX (Spanish, Mexico)
- **Secondary:** en (English US)
- **Fallback chain:** es-MX → es → en
- **URL pattern:** `/{locale}/path` e.g. `/es-mx/precios`
- **Currency:** MXN default, USD optional toggle
- **Dates:** Mexican norms (dd/mm/yyyy)
- **Text budget:** Allow 30% longer strings for Spanish
- **Coverage gate:** 90% key coverage before publishing translated content

---

## 7. Agent Architecture

### Agent roles
| Agent | Scope |
|---|---|
| ArchitectAgent | Validates scope, dependencies, structure |
| IngestAgent | Scrapes/imports legacy community data |
| LocalizationAgent | Translates and validates content |
| DesignComposerAgent | Assembles page compositions from graph matches |
| FrontendBuilderAgent | Implements page/app code |
| ThreeDAgent | 3D asset generation and optimization |
| QAAgent | Tests, screenshots, a11y audits |
| DeployAgent | Preview builds, staging/prod promotion |
| GuardianAgent | Circuit breakers, quality thresholds, rollback |

### Circuit breakers (block autonomous run if triggered)
- More than 3 services changed in one run
- Daily API cost exceeds budget ceiling
- Missing or exposed secrets detected
- Tests fail 3+ consecutive runs
- Localization coverage < 90%
- Architecture score < 8.5

---

## 8. Build Phases

| Phase | Focus | Status |
|---|---|---|
| 0 | Foundation — monorepo, config, DB, graph, i18n | ✅ In progress |
| 1 | Public site + auth + pricing + dashboard shell | ✅ In progress |
| 2 | Community engine, import, feed, remix | ✅ In progress |
| 3 | Builder + MCP + graph search + inline preview | Planned |
| 4 | 3D engine + Blender worker + scene generation | Planned |
| 5 | Analytics + moderation + perf + SLOs + rollback | Planned |

---

## 9. Release Quality Gate Checklist

Before any release to staging or production, ALL of these must pass:

- [ ] TypeScript compiles with zero errors
- [ ] All unit + integration tests pass
- [ ] E2E smoke tests pass on preview build
- [ ] es-MX localization coverage ≥ 90%
- [ ] WCAG 2.1 AA accessibility baseline met
- [ ] Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- [ ] No secrets in codebase (git-secrets / trufflehog scan)
- [ ] Architecture score ≥ 8.5 (`oma_score_architecture`)
- [ ] Design audit ≥ 8.5 (`oma_audit_design`)
- [ ] Preview deployment URL confirmed working
- [ ] DB migration runbook exists
- [ ] Rollback instruction documented

---

## 10. Security Requirements

- Vault-based secret injection (no secrets in repo)
- Input validation at all API boundaries (Zod)
- CSRF protection on all mutation routes (NextAuth + Next.js)
- Row-level security patterns for multi-tenant projects
- Rate limiting on build run and translation APIs
- Content moderation before community publish
- No user-provided HTML rendered without sanitization
