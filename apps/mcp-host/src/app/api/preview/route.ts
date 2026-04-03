// apps/mcp-host/src/app/api/preview/route.ts
// POST /api/preview — register a new preview build
// Used by the MCP oma_generate_site tool to push a build output into the host

import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

const PreviewRegisterSchema = z.object({
  buildId: z.string().min(4).max(64),
  sections: z.array(z.unknown()),
  locale: z.enum(['es-MX', 'en']).default('es-MX'),
  projectId: z.string().optional(),
});

// In-memory store for development. Replace with DB in production.
const previewStore = new Map<string, unknown>();

export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = await req.json().catch(() => null);
  const parsed = PreviewRegisterSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid request', issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const { buildId, sections, locale, projectId } = parsed.data;

  previewStore.set(buildId, { sections, locale, projectId, createdAt: new Date().toISOString() });

  const previewUrl = `/preview/${buildId}`;

  return NextResponse.json({ ok: true, previewUrl, buildId }, { status: 201 });
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const buildId = req.nextUrl.searchParams.get('buildId');
  if (!buildId) {
    return NextResponse.json({ error: 'Missing buildId' }, { status: 400 });
  }

  const preview = previewStore.get(buildId);
  if (!preview) {
    return NextResponse.json({ error: 'Preview not found' }, { status: 404 });
  }

  return NextResponse.json(preview);
}
