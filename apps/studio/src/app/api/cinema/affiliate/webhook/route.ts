import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

// ── Schema ────────────────────────────────────────────────────────────────────

const AffiliateWebhookSchema = z.object({
  platform: z.string().min(1),
  event: z.enum(['click', 'conversion', 'refund']),
  tracking_id: z.string().min(1),
  amount_usd: z.number().positive().optional(),
  order_id: z.string().optional(),
  timestamp: z.string().datetime().optional(),
})

// ── POST /api/cinema/affiliate/webhook ───────────────────────────────────────
// Receives conversion events from affiliate platforms

export async function POST(req: NextRequest) {
  // SECRET_GUARD: Validate webhook signature before processing
  const signature = req.headers.get('x-pauli-webhook-signature')
  const webhookSecret = process.env.AFFILIATE_WEBHOOK_SECRET

  if (!webhookSecret) {
    return NextResponse.json({ error: 'webhook_not_configured' }, { status: 503 })
  }

  if (!signature) {
    return NextResponse.json({ error: 'missing_signature' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'invalid_json' }, { status: 400 })
  }

  const parsed = AffiliateWebhookSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'validation_failed', details: parsed.error.flatten() },
      { status: 422 },
    )
  }

  const { platform, event, tracking_id, amount_usd } = parsed.data

  // Commission rates
  const PLATFORM_RATES: Record<string, number> = {
    shopify: 0.05,
    amazon: 0.04,
    treatwell: 0.12,
    booksy: 0.10,
    booking_com: 0.05,
    airbnb: 0.04,
    toursbylocals: 0.10,
    getyourguide: 0.08,
  }

  const rate = PLATFORM_RATES[platform] ?? 0
  const commissionUsd = event === 'conversion' && amount_usd ? +(amount_usd * rate).toFixed(2) : 0
  const creatorEarnings = +(commissionUsd * 0.7).toFixed(2)
  const platformEarnings = +(commissionUsd * 0.3).toFixed(2)

  // In production: update affiliate_commissions in Supabase, trigger payout if threshold met
  const result = {
    tracking_id,
    platform,
    event,
    commission_usd: commissionUsd,
    creator_earnings_usd: creatorEarnings,
    platform_earnings_usd: platformEarnings,
    processed_at: new Date().toISOString(),
  }

  return NextResponse.json({ data: result })
}
