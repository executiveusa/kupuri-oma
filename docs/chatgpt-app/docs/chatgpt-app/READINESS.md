# ChatGPT app readiness - staged, not submitted

## Present in this repository

- MCP server package with named, described tools and es-MX defaults.
- Spanish-first and English listing copy.
- Human approval boundary for publish/share/spend.
- CLI and Claude Code adapter using the same product language.

## Required before submission

- Deploy `apps/mcp-host` to a stable public HTTPS endpoint. The staged `/api/mcp` transport is stateless and bearer-protected; provision `MCP_AUTH_SECRET` in the deployment secret manager. Local stdio is not a ChatGPT connector.
- Replace the staged bearer gate with OAuth before any tool accesses user-specific data or before app-directory submission. The bearer gate is for private evaluation only.
- Host an accessible privacy policy and support contact on the verified product domain.
- Add Apps SDK UI resources only where conversation text is insufficient; keep controls accessible and focused.
- Verify tool annotations and separate read-only tools from consequential actions.
- Remove or fully wire every stub/placeholder tool before exposing it.
- Provide screenshots, test prompts, localization checks, CSP domains, and reviewer instructions.
- Run end-to-end tests against the deployed production endpoint, then submit from the OpenAI platform only after owner review.

Official references:

- https://developers.openai.com/apps-sdk/deploy/submission
- https://developers.openai.com/apps-sdk/app-submission-guidelines
- https://developers.openai.com/apps-sdk/quickstart
- https://developers.openai.com/apps-sdk/concepts/ui-guidelines
- https://developers.openai.com/apps-sdk/mcp-apps-in-chatgpt
