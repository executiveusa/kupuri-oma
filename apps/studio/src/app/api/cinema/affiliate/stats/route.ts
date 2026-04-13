import { NextRequest, NextResponse } from 'next/server'

// ── GET /api/cinema/affiliate/stats ──────────────────────────────────────────

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const niche = searchParams.get('niche')

  if (niche && !['fashion', 'spa', 'ecotourism'].includes(niche)) {
    return NextResponse.json({ error: 'invalid_niche' }, { status: 400 })
  }

  // In production: query affiliate_commissions table in Supabase
  const stats = {
    niche: niche ?? 'all',
    period: 'current_month',
    clicks: 0,
    conversions: 0,
    conversion_rate: 0,
    earnings_usd: 0,
    pending_usd: 0,
    paid_usd: 0,
    by_platform: [] as unknown[],
  }

  return NextResponse.json({ data: stats })
}
