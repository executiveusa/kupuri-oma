# Kupuri OMA LATAM — Master Product Brief

**Version:** 0.1.0  
**Status:** Active  
**Owner:** Kupuri Design / Execu  
**Last updated:** 2025

---

## Mission

Build the premier **Latin America-first** AI-powered design studio platform — empowering creators, agencies, and developers across México and LATAM to generate production-quality websites, marketing assets, and 3D experiences through a unified, bilingual platform.

---

## Why This Exists

1. **LATAM design market is underserved** by English-first SaaS tools that ignore MXN pricing, Spanish-first UX, and regional community norms.
2. **AI-generated UIs are uniformly terrible.** Every existing tool produces the same glassmorphism/gradient-abuse defaults. Kupuri OMA enforces the Emerald Tablet laws — clean, premium, human-designed aesthetics.
3. **Community remixing is broken.** Legacy platforms silo projects. Kupuri's graph layer makes remix lineage, vibe matching, and community learning first-class.
4. **Agents need a platform.** MCP tools, CLI workflows, and agent-orchestrated builds are production requirements, not research topics.

---

## Core Principles

| Principle | Description |
|---|---|
| **LATAM First** | es-MX is the default locale, MXN is the default currency, everything else is a translation |
| **No AI defaults** | Glassmorphism, gradient text, pill overload, bounce animations — all banned |
| **Graph-backed** | Relationships between templates, vibes, industries, remixes are first-class data |
| **Agent-ready** | Every major platform capability is exposed as an MCP tool |
| **Quality gates** | Nothing ships below 8.5/10 architecture + design scores |
| **Reversible** | All agent actions are logged, all builds rollback-able |

---

## Target Users

### Primary
- **Mexican design agencies** (3-15 person shops) building sites for local SMBs
- **Freelance creatives** in México/Colombia/Argentina who bill in MXN/COP/ARS
- **LATAM-focused SaaS startups** building marketing sites

### Secondary
- **AI/agent power users** building workflows via MCP/CLI
- **Content creators** repurposing brand assets across plaforms
- **Developers** embedding Kupuri components into their stacks

---

## Platform Surface Area

### Public (unauthenticated)
- Landing page with hero + features + community + pricing + CTA
- Community gallery (read-only)
- Template browser (read-only)
- Pricing page (MXN/USD toggle)

### Auth (registered)
- Dashboard home with stats + recent projects + build runs
- Project studio — visual builder (Phase 3)
- Community — remix, comment, like, share
- Team workspace — multi-user (Phase 4)

### Agent/CLI/API
- MCP server (7+ tools)
- CLI commands: `kupuri generate`, `kupuri import`, `kupuri translate`, `kupuri audit`
- REST API (Phase 3)

---

## Success Metrics (12-month)

| Metric | Target |
|---|---|
| Registered users | 5,000+ |
| Projects created | 20,000+ |
| Community posts | 2,000+ |
| MRR | $50,000 MXN |
| Architecture score (SYNTHIA) | ≥ 8.5 maintained |
| Localization coverage | ≥ 90% es-MX |

---

## Key Decisions Log

| Date | Decision | Reason |
|---|---|---|
| Phase 0 | pnpm workspaces + Turborepo | Monorepo performance and caching |
| Phase 0 | PostgreSQL via Prisma | Relational for billing/auth/content |
| Phase 0 | Neo4j for graph layer | Remix lineage + vibe search requires graph |
| Phase 0 | next-intl for i18n | Best App Router support, locale routing |
| Phase 0 | Plus Jakarta Sans font | Premium, LATAM-legible, not Inter |
| Phase 0 | oklch() color space | Perceptually uniform, wide gamut |
| Phase 1 | MXN as primary currency | Target market is México |
| Phase 1 | Free/Pro(299)/Studio(799)/Enterprise | Pricing calibrated to Mexican freelance market |
