export default function DocsHome() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-neutral-50 mb-2">
          Kupuri OMA — Engineering Docs
        </h1>
        <p className="text-sm text-neutral-400 leading-relaxed max-w-lg">
          Internal reference for architecture, agent prompts, deployment runbooks,
          and ops reports. Read-only portal — source of truth is{' '}
          <code className="text-violet-400 bg-neutral-900 px-1 py-0.5 rounded text-xs">
            ops/
          </code>
          .
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          {
            href: '/specs',
            title: 'Specs',
            desc: '9 architecture and product specification docs',
          },
          {
            href: '/prompts',
            title: 'Agent Prompts',
            desc: '8 bounded execution prompts for each agent role',
          },
          {
            href: '/runbooks',
            title: 'Runbooks',
            desc: 'Deploy, rollback, incident, and migration playbooks',
          },
          {
            href: '/reports',
            title: 'Ops Reports',
            desc: 'Machine-readable ZTE task completion reports',
          },
        ].map((item) => (
          <a
            key={item.href}
            href={item.href}
            className="block border border-neutral-800 rounded-xl p-4 hover:border-violet-700 transition-colors group"
          >
            <div className="text-sm font-medium text-neutral-50 group-hover:text-violet-300 transition-colors">
              {item.title}
            </div>
            <div className="text-xs text-neutral-500 mt-1">{item.desc}</div>
          </a>
        ))}
      </div>
    </div>
  );
}
