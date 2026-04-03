// apps/mcp-host/src/app/[locale]/page.tsx
// MCP Host index — shows status and active preview sessions

export default function MCPHostHome() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-lg w-full space-y-6">
        <div className="space-y-2">
          <div className="text-xs font-mono text-violet-400 tracking-widest uppercase">
            Kupuri OMA
          </div>
          <h1 className="text-2xl font-semibold text-neutral-50">
            MCP Preview Host
          </h1>
          <p className="text-sm text-neutral-400">
            Inline preview surface for agent-generated builds and MCP app outputs.
            Embed at{' '}
            <code className="text-violet-300 bg-neutral-900 px-1 py-0.5 rounded text-xs">
              /preview/:buildId
            </code>
          </p>
        </div>

        <div className="border border-neutral-800 rounded-xl p-4 space-y-3">
          <div className="text-xs font-medium text-neutral-500 uppercase tracking-wide">
            Active Sessions
          </div>
          <div className="text-sm text-neutral-400 italic">
            No active preview sessions.
          </div>
        </div>
      </div>
    </main>
  );
}
