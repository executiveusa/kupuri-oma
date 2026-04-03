// apps/mcp-host/src/app/[locale]/preview/[buildId]/page.tsx
// Render a build preview by ID — used as an iframe src in studio

import { notFound } from 'next/navigation';

interface PreviewPageProps {
  params: Promise<{ locale: string; buildId: string }>;
}

export default async function PreviewPage({ params }: PreviewPageProps) {
  const { buildId } = await params;

  // In production this would load from DB / build run storage
  // For now we render a placeholder that the MCP tool can inject content into
  if (!buildId || buildId.length < 4) notFound();

  return (
    <div
      className="min-h-screen bg-neutral-950"
      data-preview-id={buildId}
      id="oma-preview-root"
    >
      {/* Build output is hydrated into #oma-preview-root by the build engine */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-3">
          <div className="inline-block w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-neutral-400">
            Loading preview{' '}
            <code className="text-violet-400 text-xs">{buildId}</code>
          </p>
        </div>
      </div>
    </div>
  );
}
