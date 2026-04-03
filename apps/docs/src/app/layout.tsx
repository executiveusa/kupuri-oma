import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Kupuri OMA — Internal Docs',
  description: 'Engineering specs, runbooks, and agent prompts',
  robots: { index: false },
};

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-neutral-50 antialiased font-mono">
        <div className="min-h-screen flex">
          {/* Sidebar */}
          <aside className="w-56 border-r border-neutral-800 p-4 space-y-6 shrink-0">
            <div className="text-xs font-semibold text-violet-400 uppercase tracking-widest">
              Kupuri OMA Docs
            </div>
            <nav className="space-y-1">
              {[
                ['/', 'Overview'],
                ['/specs', 'Specs'],
                ['/prompts', 'Agents'],
                ['/runbooks', 'Runbooks'],
                ['/reports', 'Reports'],
              ].map(([href, label]) => (
                <a
                  key={href}
                  href={href}
                  className="block px-3 py-1.5 rounded-lg text-sm text-neutral-400 hover:text-neutral-50 hover:bg-neutral-800 transition-colors"
                >
                  {label}
                </a>
              ))}
            </nav>
          </aside>
          {/* Content */}
          <main className="flex-1 p-8 max-w-4xl">{children}</main>
        </div>
      </body>
    </html>
  );
}
