# Kupuri OMA LATAM

**La plataforma de diseño premium para América Latina.**  
Bilingual (es-MX primary / en secondary) · MXN pricing · Agent-ready · Graph-backed

---

## Monorepo Structure

```
kupuri-oma/
  apps/
    web/          Next.js 15 — marketing site (público, es-MX)
    studio/       Next.js 15 — builder autenticado (Fase 3+)
  packages/
    design-system/      Tokens, componentes, motion (Emerald Tablet)
    content-model/      Prisma schema + tipos
    graph-engine/       Neo4j driver + queries
    community-engine/   Feed, remix, import
    mcp-server/         7 MCP tools
    localization/       Mensajes es-MX + en
    shared-config/      ESLint, tsconfig, env schemas
    synthia-core/       Puntuación de arquitectura y diseño
  services/
    ingest-worker/      Ingestión de comunidad legacy
    translation-worker/ Jobs de traducción
  ops/
    specs/              Especificaciones de arquitectura y dominio
    prompts/            Prompts de agentes
    runbooks/           Runbooks operacionales
  content/
    community-seed/     Datos de seed para la comunidad
  scripts/              Build, seed y herramientas de CI
  .github/workflows/    GitHub Actions CI/CD
```

---

## Quick Start

### Prerequisites
- Node.js 20+
- pnpm 9+
- PostgreSQL 15+ (para Prisma)
- Neo4j 5.x (para graph engine)

### Install

```bash
pnpm install
```

### Configure environment

Copy `.env.example` to `.env.local` in `apps/web/` and fill in the required variables:

```
DATABASE_URL=postgresql://user:pass@localhost:5432/kupuri
NEO4J_URI=bolt://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=your-password
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=random-64-char-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Database setup

```bash
pnpm --filter @kupuri/content-model exec prisma generate
pnpm --filter @kupuri/content-model exec prisma db push
```

### Development

```bash
pnpm dev              # All apps
pnpm --filter web dev # Web app only
```

---

## Architecture Quality Gate

All releases require:
- **SYNTHIA architecture score ≥ 8.5** — `packages/synthia-core`
- **Emerald Tablet design audit ≥ 8.5** — `oma_audit_design` MCP tool
- **es-MX localization coverage ≥ 90%** — `scripts/check-l10n-coverage.mjs`

---

## Documentation

- [Master Brief](ops/specs/00-master-brief.md)
- [Architecture Spec](ops/specs/02-architecture-spec.md)
- [Design System Spec](ops/specs/05-design-system-spec.md)
- [Design Memory](.impeccable.md)

---

## License

Propietario — Kupuri Design / Execu · © 2025
