# Kupuri OMA LATAM — End-to-End AI Agent Build Handoff

## 1. Mission

Build a production-grade Latin America-first platform that:

- preserves the strongest existing Kupuri capabilities
- recreates and imports the old AMA/Omma-style community and projects
- supports remixable projects and templates
- ships bilingual UX with **Spanish (Mexico)** as the primary market language
- adds cinematic site presentation, 3D-ready experiences, and an AI-agent execution layer
- can be operated from terminal, MCP, CLI, and API with minimal manual intervention

This is an **enhancement and unification program**, not a teardown.

The new build target is a **new primary monorepo** named:

`kupuri-oma`

Kupuri is the base. Other repos and uploaded systems become source inputs, packages, patterns, or migration feeds.

---

## 2. Non-Negotiable Product Goals

### Business goals
- Launch a Latin America-first commercial product, starting with Mexico
- Preserve existing product value while improving design, automation, and scalability
- Support subscriptions, community growth, project remixing, and future 3D/AI upsells
- Create a system that can continuously generate high-quality web experiences through agents

### User goals
- Discover templates, projects, and community work in Spanish
- Remix existing projects into new builds quickly
- Preview polished, cinematic, motion-rich sites
- Use bilingual content when needed
- Access pricing, onboarding, and creation workflows that feel premium and trustworthy

### System goals
- One source of truth
- One monorepo
- One design system
- One graph-backed knowledge layer
- One repeatable delivery pipeline
- Clear agent boundaries and CI/CD gates

---

## 3. Key Inputs Consolidated

## 3.1 Kupuri as base application
The uploaded Kupuri repo contains a substantial React/Electron/Node application footprint, deployment docs, a server, tests, scripts, and multiple reports. It is the strongest practical starting point for the new product shell and operational foundation. It already includes `react/`, `server/`, `electron/`, deployment files, tests, and production-hardening material. This makes it suitable as the base repo rather than starting from zero.

## 3.2 ext-apps as MCP/app embedding model
The uploaded `ext-apps-main` repo provides MCP app patterns, multiple example servers, host integrations, testing guidance, and app/server separation. This is the right source for in-line preview flows, MCP-hosted app views, and app-to-agent rendering patterns.

## 3.3 SYNTHIA as architecture law
SYNTHIA requires:
- mandatory context scan before design
- mapping stocks, flows, and feedback loops
- extending what exists instead of duplicating it
- targeting a clean three-tier architecture at default complexity
- enforcing feedback loops, quality gates, and bounded autonomy

It also explicitly recommends a monorepo package structure for MCP services and emphasizes graph-backed learning, circuit breakers, and machine-readable ops reports. 【712087834788309†L49-L79】【712087834788309†L121-L153】【712087834788309†L203-L263】

## 3.4 LATAM migration plan
The research plan establishes:
- Spanish (Mexico) as primary localization target
- bilingual UX requirements
- adoption of `glTF/GLB`, Three.js or Babylon, and Blender-based generation
- CI/CD automation, staging/production separation, and localization QA
- an architectural direction using frontend + backend + 3D service + asset flows

It also defines MVP/v1/v2 sequencing and the need to preserve commerce/auth flows while adding 3D and localization. 【631660138594386†L137-L164】【631660138594386†L166-L199】【631660138594386†L221-L258】【631660138594386†L260-L317】

## 3.5 ZTE / Auto-Designer workflow
The uploaded ZTE deployment files include a full design automation workflow, mandatory design laws, motion primitives, dashboard/app structure, auth/api patterns, and deployment scaffolding. This is useful as an execution pattern and UX system source, but it should be normalized into the new monorepo rather than copied wholesale.

---

## 4. Decision: What repo gets updated

**Primary repo to build and update:**

`kupuri-oma` (new monorepo)

### Why
- Kupuri is strong enough to serve as the application base
- the other repos are not the product root; they are inputs
- forcing all repos to remain equal peers will create long-term architectural drift
- one monorepo reduces merge friction, duplicated configs, and fragmented deployment logic

### Source-to-target mapping
- `Kupuri-studios-main` -> base application shell and deployment patterns
- `ext-apps-main` -> MCP app bridge patterns and inline app preview infrastructure
- `cinematic-site-components` -> motion primitives and storytelling section patterns
- `Darya-designs-main` -> agent/dev workflow inspiration and optional frontend conventions
- `zte deploy files` -> deployment patterns, motion primitives, auth/api/dashboard references
- `SYNTHIA_SYSTEMS_FORCE_PROMPT...` -> architecture governance and agent design rules
- old AMA/Omma community -> migration source for seed content and remixable project inventory

---

## 5. Core Product Definition

## 5.1 Product name
Working internal name: **Kupuri OMA LATAM**

## 5.2 What the product is
A bilingual, premium, LATAM-first design studio platform that combines:
- community discovery
- remixable projects/templates
- cinematic landing page generation
- MCP/API/CLI-triggered design workflows
- optional 3D asset and scene generation
- premium subscription pricing

## 5.3 What it is not
- not a pure clone of Omma
- not a teardown of Kupuri
- not just a motion site
- not just an agent shell
- not a disconnected collection of prompts

It is a structured product and platform.

---

## 6. Product Surface Area

## 6.1 Public marketing site
Pages:
- Home
- Pricing
- Community
- Templates / Projects
- Studio / Product overview
- FAQ
- Login
- Register

## 6.2 Authenticated product
Areas:
- Dashboard
- Project library
- Remix workspace
- Prompt-to-site workflow
- Asset library
- Team/workspace settings
- Billing
- Community publishing
- Localization tools
- AI build operations log

## 6.3 Creator and admin tools
Areas:
- Project ingestion/import queue
- Translation QA queue
- Template moderation
- Pricing/content management
- Design token management
- Agent run monitoring
- Build/deploy approvals
- Analytics

---

## 7. Users and Modes

### Users
- visitor
- registered creator
- premium subscriber
- team admin
- system admin
- internal agent operator

### Modes
- browse
- remix
- generate
- publish
- collaborate
- administer

---

## 8. Monorepo Structure

```text
kupuri-oma/
  apps/
    web/                    # Next.js marketing + app shell
    studio/                 # authenticated builder / dashboard
    mcp-host/               # inline preview host / ext-apps inspired UI
    docs/                   # internal docs and ops portal
  packages/
    design-system/          # tokens, components, motion wrappers, icons
    content-model/          # schemas for projects, templates, pricing, i18n
    community-engine/       # feeds, remix logic, publishing rules
    graph-engine/           # neo4j/turso adapters, semantic graph logic
    agent-orchestrator/     # agent task planner, queues, approvals
    synthia-core/           # scoring, audit, architecture rules
    mcp-server/             # MCP tools exposed to host/CLI/API
    build-engine/           # prompt-to-site pipeline
    localization/           # es-MX/en strings, translation memory, QA rules
    three-engine/           # model-viewer / three.js integration
    media-pipeline/         # assets, thumbnails, optimization
    shared-config/          # eslint, tsconfig, prettier, env schemas
  services/
    api/                    # main backend facade if separated from web
    blender-worker/         # 3D generation worker
    ingest-worker/          # community scraping/import pipeline
    translation-worker/     # translation and validation jobs
  content/
    community-seed/
    pricing/
    copy/
    templates/
  ops/
    reports/
    runbooks/
    prompts/
    specs/
  scripts/
  tests/
```

### Rule
No repo-wide spaghetti. No duplicated design systems. No ad hoc services outside this structure.

---

## 9. Target Technical Architecture

## 9.1 Frontend
- **Next.js App Router**
- TypeScript
- Tailwind
- shared design system package
- motion wrappers over cinematic primitives
- bilingual routing strategy:
  - `/es-mx/...`
  - `/en/...`
- default locale: `es-MX`

## 9.2 Backend
- Node.js / TypeScript
- route handlers or separate API service depending on scaling needs
- background jobs for imports, translation, scene generation, screenshots
- auth + billing + content APIs
- event-driven internal workflow for agent tasks

## 9.3 Data
Primary stores:
- relational DB for users, billing, projects, permissions
- document/content layer for templates, community items, localization content
- graph DB for component relationships, style patterns, remix lineage, prompt-to-output mapping

### Stocks
Following SYNTHIA, the main system stocks are:
- users
- projects
- templates
- translations
- design tokens
- graph relationships
- agent run history
- deployment history
- trust / quality score ledger

These must be treated as durable system memory, not disposable app state. 【712087834788309†L84-L117】

## 9.4 Graph layer
Graph nodes:
- Project
- Template
- Component
- MotionPattern
- ColorSystem
- Industry
- Locale
- Asset
- Prompt
- BuildRun
- CommunityPost
- RemixEdge
- QualityScore
- AgentTask

Graph edges:
- uses
- remixes
- translates_to
- inspired_by
- belongs_to_industry
- shares_motion_family
- matches_vibe
- produced_by
- verified_by
- supersedes

This is the backbone for the “graph vibe search” requirement.

## 9.5 3D stack
- GLB/GLTF as primary delivery format
- model-viewer for simple display
- Three.js for advanced scenes and storytelling
- Blender worker for generation/transforms
- optional Babylon.js for advanced scene tooling later

This aligns with the LATAM plan’s recommendation to use glTF/GLB and a Blender-based service. 【631660138594386†L71-L132】【631660138594386†L232-L235】

---

## 10. Design System

## 10.1 Design philosophy
- premium, modern, cinematic
- sparse but emotionally rich
- clear CTA hierarchy
- strong typography
- restrained color systems
- motion with purpose, not decoration
- remixable section grammar

## 10.2 Design layers
1. tokens
2. base components
3. motion primitives
4. section blocks
5. page templates
6. industry style packs
7. locale-aware content wrappers

## 10.3 Motion primitives
Wrap the cinematic component patterns into reusable React components:
- text reveal
- sticky stack narrative
- horizontal scroll band
- parallax depth hero
- image hover reveal
- spotlight border
- magnetic CTA
- odometer / counter transitions
- ambient gradients / mesh backgrounds

## 10.4 Section grammar
Every premium marketing page is built from:
- Hero
- Proof
- Story
- Product capabilities
- Community / examples
- Pricing
- FAQ
- CTA footer

---

## 11. Localization Specification

## 11.1 Languages
- Primary: Spanish (Mexico)
- Secondary: English

## 11.2 Strategy
- all copy in translation files or CMS content
- no hard-coded UI strings
- locale-aware slugs where appropriate
- locale fallback chain:
  - `es-MX`
  - `es`
  - `en`

## 11.3 Rules
- Spanish is primary voice
- allow longer text lengths
- all pricing displayed in MXN by default
- all date formatting uses Mexican norms
- community content stores both original and translated versions
- translation QA required before publishing imported content

These rules are directly supported by the LATAM requirements in the migration plan. 【631660138594386†L137-L164】

---

## 12. Community and Remix Engine

## 12.1 Objective
Recreate the old community as a living seed layer, not as static archived pages.

## 12.2 Ingestion pipeline
1. scrape old community pages
2. extract page metadata, project title, author, tags, screenshots, copy, code snippets if available
3. normalize into `CommunityProject` schema
4. translate into es-MX
5. preserve English version
6. generate thumbnails and quality metadata
7. store in DB + graph
8. publish to new community feed

## 12.3 Remix model
Each project has:
- public detail page
- source metadata
- design tags
- vibe tags
- motion tags
- industry tags
- locale content
- remix button
- derivative lineage tracking

When remixed:
- duplicate content schema
- attach a new owner/workspace
- preserve a parent-child graph edge
- open in builder with inherited style pack and asset suggestions

## 12.4 Community UX
Views:
- latest
- featured
- by industry
- by vibe
- by motion pattern
- by language
- by remix count
- by premium / free

---

## 13. MCP / API / CLI Build Layer

## 13.1 Goal
Everything important should be invokable from terminal, MCP, or API.

## 13.2 Primary interfaces
- CLI:
  - import community
  - run translation
  - build page
  - score design
  - publish project
  - deploy preview
- MCP tools:
  - `oma_audit_design`
  - `oma_graph_search`
  - `oma_generate_site`
  - `oma_import_community`
  - `oma_translate_project`
  - `oma_score_architecture`
  - `oma_publish_template`
- API:
  - project CRUD
  - build run orchestration
  - preview generation
  - asset upload
  - graph search
  - translation
  - community publishing

## 13.3 Inline preview
Use `ext-apps-main` patterns to support inline app rendering and MCP-hosted previews so an agent can return a preview surface directly in context.

---

## 14. Agent Architecture

## 14.1 Principle
Do not use one giant prompt to do everything forever.

Use:
- one master constitution
- one spec kit
- one task planner
- multiple bounded execution prompts

This follows SYNTHIA’s scope-discipline and blast-radius rules. 【712087834788309†L236-L263】

## 14.2 Agent roles
- **Architect Agent**
  - validates scope, dependencies, structure
- **Ingest Agent**
  - scrapes/imports legacy community data
- **Localization Agent**
  - translates and validates content
- **Design Composer Agent**
  - assembles section/page compositions from graph matches
- **Frontend Builder Agent**
  - implements page/app code
- **3D Agent**
  - generates or optimizes 3D assets
- **QA Agent**
  - runs tests, screenshots, audits, accessibility checks
- **Deploy Agent**
  - creates previews, promotes builds
- **Guardian Agent**
  - enforces circuit breakers, quality thresholds, rollback policies

## 14.3 Task graph
The orchestrator decomposes work into DAG tasks:
- task
- dependency
- cost ceiling
- files touched
- service scope
- validation rule
- rollback instruction

## 14.4 Circuit breakers
Block or pause automatically if:
- more than 3 services would change in one autonomous run
- daily API or model cost exceeds budget
- secrets are missing or exposed
- tests fail repeatedly
- localization coverage falls under threshold
- UDEC/system score is below the release threshold

This matches the SYNTHIA feedback and circuit-breaker model. 【712087834788309†L260-L263】

---

## 15. Product Pages and Flows

## 15.1 Marketing site flow
- landing -> proof -> pricing -> community -> auth/signup

## 15.2 Community flow
- browse -> filter -> open project -> remix -> preview -> save -> publish

## 15.3 Build flow
- prompt / choose template -> graph search -> compose sections -> build preview -> edit -> publish

## 15.4 Team flow
- workspace -> invite -> assign roles -> shared projects -> deploy

## 15.5 Billing flow
- compare plans -> checkout -> activate workspace -> unlock premium templates / higher build limits

---

## 16. Pricing Strategy for Mexico / LATAM

## 16.1 Principle
Mirror the Omma-style structure, but price for the regional market and purchasing power.

## 16.2 Tiers
- Free
  - browse community
  - limited remixes
  - limited previews
- Pro
  - more builds
  - premium templates
  - bilingual publishing
  - basic 3D embeds
- Studio
  - team collaboration
  - advanced build orchestration
  - priority generation
  - analytics
- Enterprise
  - custom deployments
  - governance
  - white-label / dedicated support

## 16.3 Default display
- MXN primary
- optional USD toggle

---

## 17. Data Schemas (High Level)

## 17.1 Project
- id
- slug
- title
- description
- locale
- translations[]
- authorId
- templateId
- parentProjectId
- status
- screenshots[]
- assets[]
- publishSettings
- remixCount
- qualityScore
- createdAt
- updatedAt

## 17.2 Template
- id
- name
- industry
- vibe
- motionFamily[]
- locales[]
- premium
- sectionSchema
- tokenPackId
- heroType
- 3dReady
- sourceRepoRef

## 17.3 BuildRun
- id
- projectId
- prompt
- graphQuery
- selectedNodes[]
- tasks[]
- outputPreviewUrl
- logs
- score
- status
- cost
- runtimeMs

## 17.4 CommunityPost
- id
- projectId
- summary
- locale
- tags[]
- featured
- importedFrom
- moderationState

## 17.5 AgentTask
- id
- runId
- type
- dependencies[]
- ownerAgent
- status
- touchedFiles[]
- validations[]
- costCeiling

---

## 18. Import and Migration Plan

## 18.1 Legacy community import
Phase 1:
- inventory pages
- build page extractor
- store raw snapshots
- normalize records

Phase 2:
- translate text
- map categories and tags
- create project detail pages

Phase 3:
- attach remix metadata
- publish in new community feed

## 18.2 Existing Kupuri features retention
Preserve and port:
- auth
- account/profile
- any useful commerce or billing structures
- dashboard patterns
- deployment knowledge
- testing/deployment scripts where still relevant

## 18.3 Design migration
Extract:
- strong sections
- useful components
- copy patterns
- motion utilities
- dashboard pieces
Discard:
- duplicated experiments
- obsolete docs
- repo noise
- ad hoc branches embedded in source

---

## 19. Build Phases

## Phase 0 — Foundation
- create `kupuri-oma` monorepo
- import base app shell from Kupuri
- establish shared config
- establish design tokens
- establish i18n
- establish DB and graph connections
- write ops docs and prompts

## Phase 1 — Public site + auth
- home
- pricing
- login/register
- initial dashboard shell
- bilingual routing
- MXN pricing
- initial motion system

## Phase 2 — Community engine
- import legacy community
- filters and project pages
- remix model
- publishing flow

## Phase 3 — Builder + MCP
- graph search
- prompt-to-template flow
- inline preview
- CLI / MCP tools
- machine-readable run logs

## Phase 4 — 3D and advanced creative
- model-viewer support
- Three.js storytelling sections
- Blender worker
- scene generation hooks

## Phase 5 — Scale and harden
- analytics
- moderation
- audit scoring
- perf optimization
- rollout, SLOs, rollback routines

---

## 20. Quality Gates

## 20.1 Release gates
A release cannot ship unless:
- tests pass
- localization coverage threshold is met
- accessibility baseline is met
- preview build passes
- page performance stays within budget
- architecture and design score exceed threshold
- secrets are safe
- rollback path exists

## 20.2 Audit framework
Use a combined gate:
- UDEC design score target: `>= 8.5`
- architecture/system score target: `>= 8.5`
- no critical failures in resilience, feedback completeness, or security

SYNTHIA explicitly sets 8.5 as the floor and blocks weak feedback/resilience/security architecture. 【712087834788309†L22-L45】【712087834788309†L121-L153】

---

## 21. CI/CD and Environments

## Environments
- local
- preview
- staging
- production

## Pipelines
- lint
- typecheck
- unit tests
- integration tests
- E2E tests
- screenshot comparisons
- localization checks
- bundle / perf budget checks
- preview deployment
- approval gate for prod

The LATAM plan already requires staging/production separation and automated testing before deployment. 【631660138594386†L291-L317】【631660138594386†L319-L344】

---

## 22. Security and Ops

## 22.1 Secrets
- use vault-based secret injection
- no secrets in repo
- no secrets in prompts
- env validation on boot

## 22.2 Observability
- structured logs
- agent run reports
- audit logs
- deployment logs
- import/translation logs
- error monitoring

## 22.3 Rollback
- immutable preview builds
- release tagging
- DB migration discipline
- independent service rollback where possible

---

## 23. Deliverables the AI Agent Must Produce

1. Monorepo scaffold
2. Shared config package
3. Design system package
4. Public marketing pages
5. Auth flows
6. Dashboard shell
7. Community data model and feed
8. Import workers
9. Translation worker
10. Graph schema and adapters
11. Remix pipeline
12. MCP server with tools
13. CLI commands
14. Preview generation flow
15. Pricing page for MX
16. Seed content import
17. Test suite
18. CI/CD workflows
19. Ops reports
20. Deployment runbook

---

## 24. File-by-File Initial Build List

```text
ops/specs/
  00-master-brief.md
  01-product-spec.md
  02-architecture-spec.md
  03-community-migration-spec.md
  04-localization-spec.md
  05-design-system-spec.md
  06-agent-graph-spec.md
  07-deployment-spec.md
  08-qa-spec.md

ops/prompts/
  00-master-constitution.md
  01-architect-agent.md
  02-ingest-agent.md
  03-localization-agent.md
  04-design-composer-agent.md
  05-frontend-builder-agent.md
  06-qa-agent.md
  07-deploy-agent.md

packages/design-system/
packages/content-model/
packages/graph-engine/
packages/synthia-core/
packages/mcp-server/
packages/community-engine/

apps/web/
apps/studio/
apps/mcp-host/

services/ingest-worker/
services/translation-worker/
services/blender-worker/
```

---

## 25. Master Execution Order for the AI Agent

1. Initialize monorepo
2. Import Kupuri base
3. Normalize package structure
4. Add shared config
5. Add i18n and locale routing
6. Create design-system package
7. Implement public pages
8. Implement auth and dashboard shell
9. Create content schemas
10. Build graph schema
11. Build community import worker
12. Import seed projects
13. Build community feed and project pages
14. Add remix flow
15. Add MCP tools
16. Add inline preview host
17. Add pricing and billing flow
18. Add 3D display support
19. Add Blender worker
20. Add QA + CI/CD
21. Run audits
22. Fix all blockers
23. Deploy preview
24. Promote to staging
25. Release production

---

## 26. Prompting Strategy for the Agent

Do **not** use a single mega-prompt that tries to build everything in one run.

Use:
- one constitution prompt
- one spec ingestion step
- one planner step
- one phase runner per phase
- one validation step per phase

### Required prompt chain
1. Load constitution
2. Load master brief
3. Scan repo
4. Generate dependency-aware task DAG
5. Execute Phase 0
6. Validate
7. Execute Phase 1
8. Validate
9. Continue through Phase 5

This reduces hallucination, preserves architecture, and respects feedback loops.

---

## 27. Ready-to-Run Master Prompt for the Build Agent

```text
You are the build orchestrator for the `kupuri-oma` monorepo.

Your job is to implement the platform described in the handoff spec.

Operating rules:
1. Read the full handoff spec first.
2. Scan the repo before editing anything.
3. Reuse existing structure before creating new modules.
4. Do not flatten architecture.
5. Do not create duplicate design systems.
6. Keep all work inside the monorepo structure defined by the handoff.
7. Use Spanish (Mexico) as the default locale and English as secondary.
8. Preserve legacy Kupuri value where useful.
9. Import legacy community content as seed content for remixable projects.
10. Use graph-backed search and lineage for projects/templates/components.
11. Keep agent tasks bounded by service scope and file ownership.
12. Produce machine-readable reports in `ops/reports/`.
13. After each phase, run tests, summarize changes, and list blockers.
14. Never claim completion without validation.
15. Target a production-ready result, not a demo.

Execution order:
- parse specs
- scan codebase
- produce implementation DAG
- execute Phase 0 through Phase 5
- validate after each phase
- stop only on explicit blocker or completion
```

---

## 28. Acceptance Criteria

The build is complete only when:

- the new monorepo exists and runs
- marketing site is bilingual and production-grade
- community is populated with imported seed projects
- remix flow works
- pricing is adapted for Mexico / LATAM
- MCP/CLI/API flows exist
- preview generation works
- graph search works
- tests pass
- CI/CD is configured
- staging and production plans exist
- a new agent can continue from the repo and `ops/` docs without extra explanation

---

## 29. Final Recommendation

Build from **one new monorepo** based on **Kupuri as the base**, not from a giant uncontrolled merge and not from a single mega-prompt.

The correct delivery model is:

- **one repo**
- **one spec kit**
- **one ops layer**
- **multiple bounded agents**
- **graph-backed memory**
- **phase-by-phase execution**
- **quality gates at every release boundary**

This is the fastest path to something that is both premium and actually operable.

---

## 30. Source Notes

This handoff was consolidated from:
- uploaded Kupuri repo structure
- uploaded `ext-apps-main`
- uploaded `zte deploy files`
- uploaded SYNTHIA systems prompt
- uploaded LATAM deep research plan
- user-stated product direction in this session

Key source anchors:
- SYNTHIA mandatory context scan, stocks/flows/feedback loops, complexity dials, and MCP server structure【712087834788309†L49-L79】【712087834788309†L121-L153】【712087834788309†L203-L263】
- LATAM migration requirements for Spanish (Mexico), glTF/Three.js/Blender, staging/production, QA, and phased delivery【631660138594386†L137-L164】【631660138594386†L166-L199】【631660138594386†L221-L258】【631660138594386†L260-L344】
