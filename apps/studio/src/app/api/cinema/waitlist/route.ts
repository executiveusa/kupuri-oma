import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// ── Schema ────────────────────────────────────────────────────────────────────

const WaitlistSchema = z.object({
  email: z.string().email(),
  niche: z.enum(['education', 'anime', 'game-dev']),
})

// ── POST /api/cinema/waitlist ─────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = WaitlistSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'validation_failed', details: parsed.error.flatten() },
      { status: 422 },
    )
  }

  const { email, niche } = parsed.data

  // Validate Supabase is configured
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !supabaseKey) {
    return NextResponse.json({ error: 'database_not_configured' }, { status: 503 })
  }

  // In production: insert into waitlist table in Supabase + trigger welcome email
  const entry = {
    id: crypto.randomUUID(),
    email,
    niche,
    position: 1,
    joined_at: new Date().toISOString(),
  }

  return NextResponse.json({ data: entry }, { status: 201 })
}
