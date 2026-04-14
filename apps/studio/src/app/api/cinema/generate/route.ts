import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// ── Schema ────────────────────────────────────────────────────────────────────

const GenerateVideoSchema = z.object({
  character_id: z.string().uuid(),
  niche: z.enum(['fashion', 'spa', 'ecotourism']),
  prompt: z.string().min(10).max(1000),
  duration_seconds: z.number().int().min(5).max(60).default(15),
  motion_type: z.enum(['pan', 'zoom', 'orbit', 'static', 'walk']).default('pan'),
  color_grade: z.enum([
    'cinematic',
    'warm',
    'cool',
    'vintage',
    'moody',
    'bright',
    'neutral',
  ]).default('cinematic'),
})

// ── Cost calculator ───────────────────────────────────────────────────────────

function calculateGenerationCost(durationSeconds: number): number {
  const keyframeCost = 0.5
  const videoCostPerSecond = 2.0 / 15
  const higgsfieldCost = 0.3
  const colorGradeCost = 0.1
  const scoringCost = 0.2
  return +(keyframeCost + videoCostPerSecond * durationSeconds + higgsfieldCost + colorGradeCost + scoringCost).toFixed(2)
}

// ── POST /api/cinema/generate ─────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = GenerateVideoSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'validation_failed', details: parsed.error.flatten() },
      { status: 422 },
    )
  }

  const { character_id, niche, prompt, duration_seconds, motion_type, color_grade } = parsed.data

  // COST_GUARD circuit breaker
  const estimatedCost = calculateGenerationCost(duration_seconds)
  const singleJobLimit = 5.0
  if (estimatedCost > singleJobLimit) {
    return NextResponse.json(
      {
        error: 'cost_guard_triggered',
        estimated_cost: estimatedCost,
        limit: singleJobLimit,
        message: `Estimated cost $${estimatedCost} exceeds single-job limit $${singleJobLimit}`,
      },
      { status: 402 },
    )
  }

  // Validate required environment
  const modalTokenId = process.env.MODAL_TOKEN_ID
  const modalTokenSecret = process.env.MODAL_TOKEN_SECRET
  if (!modalTokenId || !modalTokenSecret) {
    return NextResponse.json({ error: 'gpu_service_not_configured' }, { status: 503 })
  }

  const jobId = crypto.randomUUID()

  // In production: dispatch to Modal.com GPU queue via Redis
  // Pipeline: FLUX.2 keyframe → Kling 3.0 video → Higgsfield consistency → FFmpeg grade → UDEC score
  const job = {
    id: jobId,
    character_id,
    niche,
    prompt,
    duration_seconds,
    motion_type,
    color_grade,
    status: 'queued',
    estimated_cost_usd: estimatedCost,
    estimated_minutes: { min: 8, max: 15 },
    quality_minimum: 8.5,
    created_at: new Date().toISOString(),
  }

  return NextResponse.json({ data: job }, { status: 202 })
}

// ── GET /api/cinema/generate/:jobId — polled by client ────────────────────────
// Handled in /api/cinema/generate/[jobId]/route.ts
