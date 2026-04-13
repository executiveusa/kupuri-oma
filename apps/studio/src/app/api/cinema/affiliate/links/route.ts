import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// ── Schema ────────────────────────────────────────────────────────────────────

const GenerateLinkSchema = z.object({
  platform: z.enum([
    'shopify',
    'amazon',
    'zalora',
    'mercadolibre',
    'asos',
    'treatwell',
    'booksy',
    'square',
    'acuity',
    'booking_com',
    'airbnb',
    'toursbylocals',
    'getyourguide',
  ]),
  product_id: z.string().min(1).max(500),
  niche: z.enum(['fashion', 'spa', 'ecotourism']),
  video_id: z.string().uuid().optional(),
})

// ── POST /api/cinema/affiliate/links ─────────────────────────────────────────

export async function POST(req: NextRequest) {
  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = GenerateLinkSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'validation_failed', details: parsed.error.flatten() },
      { status: 422 },
    )
  }

  const { platform, product_id, niche, video_id } = parsed.data

  // Commission rates by platform
  const COMMISSION_RATES: Record<string, number> = {
    shopify: 0.05,
    amazon: 0.04,
    zalora: 0.03,
    mercadolibre: 0.03,
    asos: 0.02,
    treatwell: 0.12,
    booksy: 0.10,
    square: 0.05,
    acuity: 0.05,
    booking_com: 0.05,
    airbnb: 0.04,
    toursbylocals: 0.10,
    getyourguide: 0.08,
  }

  const trackingId = crypto.randomUUID().split('-')[0]

  // In production: store tracking link in Supabase, use platform affiliate SDK
  const link = {
    id: trackingId,
    platform,
    product_id,
    niche,
    video_id: video_id ?? null,
    tracking_url: `https://track.pauli.app/aff/${trackingId}`,
    commission_rate: COMMISSION_RATES[platform] ?? 0,
    created_at: new Date().toISOString(),
  }

  return NextResponse.json({ data: link }, { status: 201 })
}
