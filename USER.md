# USER.md — Project Owner Context

## Owner

- **Handle:** executiveusa / The Pauli Effect
- **Primary market:** Latin America (Mexico first)
- **Product:** Kupuri OMA LATAM — LATAM-first AI design studio platform
- **GitHub:** executiveusa/kupuri-oma

---

## Product goals

1. Launch a Mexican/LATAM commercial product — bilingual, premium, MXN-priced
2. Recreate the AMA/Omma community as remixable seed content
3. Enable cinematic, 3D-ready site generation through agents and MCP
4. Operate the system from terminal, MCP, CLI, and API without manual intervention

---

## Current build phase

**Phase 2 → 3**: Community engine live, moving into Builder + MCP layer.

Phases:
- ✅ Phase 0: Monorepo, shared config, design system, i18n
- ✅ Phase 1: Public site + auth + dashboard (apps/web, apps/studio)
- 🔄 Phase 2: Community engine (ingest, graph, remix)
- 🔲 Phase 3: Builder + MCP (build-engine, mcp-host, CLI)
- 🔲 Phase 4: 3D (three-engine, blender-worker)
- 🔲 Phase 5: Scale and harden

---

## Pricing (Mexico / LATAM)

| Tier | Price | Key features |
|---|---|---|
| Free | $0 MXN | Browse, limited remixes |
| Pro | $299 MXN/mo | Premium templates, bilingual publish |
| Studio | $799 MXN/mo | Team, advanced orchestration |
| Enterprise | Custom | White-label, dedicated support |

---

## Technical stack (do not change without spec update)

- Next.js 15 App Router + TypeScript 5.7 + Tailwind CSS 3.4
- pnpm workspaces + Turborepo 2.x
- next-intl 3.26 — locale routing `/[locale]/...` — default es-MX
- PostgreSQL + Prisma 6 (content-model)
- Neo4j 5 (graph-engine)
- @modelcontextprotocol/sdk (mcp-server)
- Framer Motion 11 (design-system)
- Three.js + @react-three/fiber (three-engine)
- Sharp (media-pipeline)

---

## Active channels (notification back-channel)

- Primary: terminal / Beads task manager
- Secondary: GitHub PR comments (CI gates)
- Future: Telegram bot (claudeclaw channel pattern — not yet wired)

---

## Known constraints

- BLAST_RADIUS_GUARD: max 3 services per autonomous run
- SYNTHIA gate: 8.5 score minimum before any UI ships
- No glassmorphism — ever
- All new pages must pass WCAG AA (accessibility baseline)
- Secrets via vault only — never in repo or prompts
