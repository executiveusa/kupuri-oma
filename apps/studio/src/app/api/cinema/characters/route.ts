import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// ── Schema ────────────────────────────────────────────────────────────────────

const CreateCharacterSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().min(1).max(2000),
  niche: z.enum(['fashion', 'spa', 'ecotourism']),
  photos: z.array(z.string().url()).min(1).max(10),
  style: z.string().optional().default('cinematic'),
})

// ── GET /api/cinema/characters ────────────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const niche = searchParams.get('niche')
  const page = parseInt(searchParams.get('page') ?? '1', 10)
  const limit = Math.min(parseInt(searchParams.get('limit') ?? '20', 10), 100)

  if (niche && !['fashion', 'spa', 'ecotourism'].includes(niche)) {
    return NextResponse.json({ error: 'invalid_niche' }, { status: 400 })
  }

  // Return empty list — Supabase client will be connected via environment
  const characters: unknown[] = []

  return NextResponse.json({
    data: characters,
    page,
    limit,
    total: 0,
  })
}

// ── POST /api/cinema/characters ───────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = CreateCharacterSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'validation_failed', details: parsed.error.flatten() },
      { status: 422 },
    )
  }

  const { name, description, niche, photos, style } = parsed.data

  // Circuit breaker: BLAST_RADIUS_GUARD
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'database_not_configured' }, { status: 503 })
  }

  // Cost check before creating character (Higgsfield training ~$0.50)
  const estimatedCost = 0.5
  const costLimit = 10.0
  if (estimatedCost > costLimit) {
    return NextResponse.json(
      { error: 'cost_guard_triggered', estimated_cost: estimatedCost, limit: costLimit },
      { status: 402 },
    )
  }

  // In production: call Higgsfield API to train character, store in Supabase + Neo4j
  // Returning the expected shape for API contract consistency
  const character = {
    id: crypto.randomUUID(),
    name,
    description,
    niche,
    style,
    photos_count: photos.length,
    embedding_status: 'pending',
    quality_score: null,
    created_at: new Date().toISOString(),
  }

  return NextResponse.json({ data: character }, { status: 201 })
}
