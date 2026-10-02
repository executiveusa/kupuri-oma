# PRDF - kupuri-oma (Production Readiness & Design Findings)
Inspected: 2026-09-28. Real code inspection (monorepo, no full build run - pnpm workspace, build = turbo across 4+ apps). Benchmark: Collins + gauntlet.

## VERDICT: TIER 2 - REAL AGENT PLATFORM, PARKED MID-BUILD
"Kupuri OMA LATAM - Bilingual Latin America-first design studio platform." pnpm/turbo monorepo: agents/ (design, executor, ingest, qa), apps/ (docs, mcp-host, studio, web), packages/ (agent-orchestrator, build-engine, claude-code-plugin, +), services/, Dockerfile + docker-compose.production, cron-registry. 407 files, 14 test files. Live URL 307-redirects. Per the agent-city readiness doc: parked, no city integration (repo content - informational).

## EVIDENCE
- Real monorepo structure with agent roles matching a studio pipeline (design -> executor -> qa).
- Production deployment artifacts present (Dockerfile, compose.production).
- Heavy vision-doc trail (SOUL.md, HEART_AND_SOUL.md, handoff docs) - vision-rich, completion unclear without a full workspace build (not run: pnpm install across 4 apps exceeds the audit window).

## VIOLATIONS / GAPS
1. MED - Build/test state UNVERIFIED (turbo workspace not built in audit). Fix: CI that builds all apps + runs the 14 test files.
2. MED - Parked without a status doc at repo root stating what works (visitors cannot tell vision from running code). Fix: honest STATUS.md.
3. LOW - 307-redirect deploy: confirm target is intended.
4. INFO - This repo is the strongest candidate to power "her own starnet with agents" alongside kupuri-agent-city - architecture conversation for the owner.

## FIX LIST
1 (2-3h) workspace CI; 2 (30m) STATUS.md; 3 (15m) redirect check. Estimated: half a day for verifiable truth.

## PORTFOLIO ROLE
Not a client-facing site - it is platform infrastructure. Present only to technical buyers.
