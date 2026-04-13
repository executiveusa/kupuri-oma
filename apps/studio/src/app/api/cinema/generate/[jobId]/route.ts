import { NextRequest, NextResponse } from 'next/server'

interface RouteParams {
  params: Promise<{ jobId: string }>
}

// ── GET /api/cinema/generate/:jobId ──────────────────────────────────────────

export async function GET(_req: NextRequest, { params }: RouteParams) {
  const { jobId } = await params

  if (!jobId || !/^[0-9a-f-]{36}$/.test(jobId)) {
    return NextResponse.json({ error: 'invalid_job_id' }, { status: 400 })
  }

  // In production: query Redis job queue + Supabase for status
  // Stages: queued → keyframe_generating → video_generating → color_grading → scoring → completed | failed
  const job = {
    id: jobId,
    status: 'queued',
    stage: 'queued',
    progress: 0,
    quality_score: null,
    video_url: null,
    thumbnail_url: null,
    error: null,
    cost_usd: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }

  return NextResponse.json({ data: job })
}
