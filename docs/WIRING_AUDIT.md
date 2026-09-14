# Full-stack wiring audit - product elevation slice

| Promise                     | Surface                 | Handler / transport                       | Canonical result             | Evidence                        | State                                      |
| --------------------------- | ----------------------- | ----------------------------------------- | ---------------------------- | ------------------------------- | ------------------------------------------ |
| Prepare a bilingual brief   | CLI `oma brief`         | local argument parser                     | JSON draft file/stdout       | typecheck, build, smoke fixture | WIRED                                      |
| Prepare a Claude Code brief | `/oma-brief`            | plugin command prompt                     | reviewed draft in session    | manifest + command present      | STAGED, requires host test                 |
| Search OMA references       | MCP `oma_graph_search`  | MCP stdio to graph engine                 | graph query result           | MCP typecheck/build             | WIRED to dependency, runtime DB unverified |
| Audit a component           | MCP `oma_audit_design`  | MCP stdio local heuristic                 | structured score             | MCP typecheck/build             | WIRED                                      |
| Generate a site             | MCP `oma_generate_site` | placeholder response                      | random in-memory run ID      | source inspection               | STUB - do not expose publicly              |
| Import/translate/publish    | MCP tools               | placeholder responses                     | no verified durable mutation | source inspection               | STUB - do not expose publicly              |
| Buy Pro/Studio              | pricing page            | private access contact link               | interest only                | Next build                      | STAGED, billing intentionally off          |
| Use in ChatGPT              | draft listing           | requires deployed HTTPS MCP/OAuth/privacy | OpenAI review                | readiness checklist             | STAGED, not submitted                      |

## Release blockers

- Replace MCP mutation placeholders with durable job/state owners or remove them from the public tool list.
- Runtime-test graph search against a configured Neo4j instance.
- Add auth, privacy URL, support contact and a deployed HTTPS MCP endpoint.
- Verify the Claude Code plugin in the host, not only as files.
- Fix existing authentication TODOs and remove unsupported usage claims before public launch.
