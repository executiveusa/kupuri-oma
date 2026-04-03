# Kupuri OMA — Agent Graph Specification

**Version:** 0.1.0  
**Status:** Phase 0 (roles defined) / Phase 3 (execution)  

---

## 1. Agent Roster

| Agent ID | Name | Scope | Tier |
|---|---|---|---|
| `arch` | ArchitectAgent | Validates structure, dependencies, graph schema | 1 (blocking) |
| `ingest` | IngestAgent | Scrapes, normalizes, and imports community data | 2 |
| `l10n` | LocalizationAgent | Translates content and validates locale coverage | 2 |
| `designer` | DesignComposerAgent | Assembles page compositions from graph-matched templates | 2 |
| `frontend` | FrontendBuilderAgent | Implements React/Next.js pages and components | 2 |
| `3d` | ThreeDAgent | 3D asset generation and Blender-worker coordination | 3 |
| `qa` | QAAgent | Tests, screenshots, accessibility audits | 2 (blocking exit) |
| `deploy` | DeployAgent | Preview builds, staging promotion, prod releases | 3 (requires approval) |
| `guardian` | GuardianAgent | Circuit breakers, thresholds, forced stop, rollback | 1 (always active) |

---

## 2. Agent Execution DAG

```
User Request
  │
  ▼
GuardianAgent (always wraps, circuit-breaker enforcement)
  │
  ▼
ArchitectAgent ─── FAIL ─→ BLOCKED (explain + stop)
  │ PASS
  ▼
┌─────────────────────────────────┐
│  Parallel execution tier 2:     │
│  IngestAgent (if data job)      │
│  LocalizationAgent (if content) │
│  DesignComposerAgent (if UI)    │
│  FrontendBuilderAgent (if code) │
└─────────────────────────────────┘
  │ All complete
  ▼
QAAgent ─── FAIL ─→ RETRY (max 3) ─→ BLOCKED
  │ PASS
  ▼
(If requires 3D):
ThreeDAgent
  │
  ▼
DeployAgent (requires human approval for production)
  │
  ▼
GuardianAgent final check
  │ PASS
  ▼
COMPLETE
```

---

## 3. Circuit Breakers (GuardianAgent)

GuardianAgent monitors these conditions. If ANY are triggered, it forces an immediate
HALT and requires human review before resuming.

| Condition | Threshold | Action |
|---|---|---|
| Services modified in one run | > 3 | HALT, require scope review |
| Daily API cost | > budget ceiling | HALT, require budget approval |
| Missing secrets detected | ANY | HALT, require secret injection |
| Exposed secrets detected | ANY | HALT IMMEDIATELY, notify, do not continue |
| Test failures (consecutive) | ≥ 3 runs | HALT, require manual fix |
| Localization coverage | < 90% | WARN on deploy; HALT on production |
| Architecture score | < 8.5 | BLOCK deploy |
| Design audit score | < 8.5 | BLOCK deploy |
| Build size increase | > 30% | WARN, require approval |
| DB migration risk | HIGH | Require manual runbook confirmation |

---

## 4. Agent Communication Protocol

All agents communicate through structured `AgentTask` records in Prisma:

```typescript
interface AgentTask {
  id: string
  buildRunId: string
  agentId: string              // 'arch' | 'ingest' | 'l10n' | ...
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'BLOCKED'
  input: Record<string, unknown>   // Typed per agent
  output: Record<string, unknown>  // Typed per agent
  startedAt: Date | null
  completedAt: Date | null
  error: string | null
  parentTaskId: string | null      // For sub-tasks
  cost: number                     // API cost in USD
}
```

---

## 5. Graph Queries for Agent Decisions

### DesignComposerAgent: find matching templates
```cypher
MATCH (p:Project {id: $projectId})-[:MATCHES_VIBE]->(v:Vibe)
MATCH (t:Template)-[:MATCHES_VIBE]->(v)
WHERE t.status = 'APPROVED'
WITH t, COUNT(v) AS vibeScore
OPTIONAL MATCH (t)-[:BELONGS_TO_INDUSTRY]->(i:Industry {code: $industry})
WITH t, vibeScore + (CASE WHEN i IS NOT NULL THEN 2 ELSE 0 END) AS score
OPTIONAL MATCH (t)-[:SHARES_MOTION_FAMILY]->(m:MotionPattern {name: $motionFamily})
WITH t, score + (CASE WHEN m IS NOT NULL THEN 1 ELSE 0 END) AS totalScore
RETURN t ORDER BY totalScore DESC LIMIT 5
```

### IngestAgent: find pending import jobs
```cypher
MATCH (b:BuildRun {status: 'RUNNING'})-[:HAS_TASK]->(t:AgentTask {agentId: 'ingest', status: 'PENDING'})
RETURN t ORDER BY t.createdAt ASC LIMIT 10
```

---

## 6. Agent Prompt Templates

All agent system prompts live in `ops/prompts/`. Each prompt must include:

1. **Role declaration** — who this agent is, what it does only
2. **SYNTHIA core laws** — the 10 Emerald Tablet laws (inline or referenced)
3. **Input schema** — exact JSON structure expected
4. **Output schema** — exact JSON structure to produce
5. **Guardrails** — explicit list of things this agent must NEVER do
6. **Escalation rules** — when to HALT vs. WARN vs. proceed

---

## 7. Task Approval Requirements

| Action | Approval Required | Who Approves |
|---|---|---|
| Run any agent in READ mode | None | Auto |
| Generate preview build | None | Auto |
| Create new DB migration | Yes | Project owner |
| Promote to staging | Yes | Project owner |
| Promote to production | Yes | Project owner + manual deploy gate |
| Delete any data | Yes | Project owner |
| Modify team permissions | Yes | Team admin |
| Exceed daily cost budget | Yes | Project owner |

---

## 8. Observability

All agent tasks write to:
- `ops/reports/agent_run_<buildRunId>.json` (machine-readable)
- `BuildRun` and `AgentTask` Prisma records (queryable)
- Graph nodes: `BuildRun` → `AgentTask` edges in Neo4j (for lineage)

Required fields in every agent run log:
- `agentId`, `buildRunId`, `startedAt`, `completedAt`, `duration_ms`
- `inputSummary`, `outputSummary`, `cost_usd`
- `violations` (array of circuit breaker checks)
- `passed` (boolean final status)
