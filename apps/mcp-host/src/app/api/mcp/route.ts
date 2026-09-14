import { NextRequest, NextResponse } from 'next/server'
import { handleMcp, type RpcRequest } from '../../../lib/mcp-core'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const unauthorized = () =>
  NextResponse.json(
    { error: 'Unauthorized' },
    { status: 401, headers: { 'WWW-Authenticate': 'Bearer' } },
  )
const securityHeaders = { 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }

export async function POST(request: NextRequest) {
  const secret = process.env.MCP_AUTH_SECRET
  if (!secret || secret === 'replace-with-strong-secret')
    return NextResponse.json(
      { error: 'MCP endpoint is not configured' },
      { status: 503, headers: securityHeaders },
    )
  if (request.headers.get('authorization') !== `Bearer ${secret}`) return unauthorized()
  if (!request.headers.get('content-type')?.includes('application/json'))
    return NextResponse.json(
      { error: 'Content-Type must be application/json' },
      { status: 415, headers: securityHeaders },
    )

  const body = (await request.json().catch(() => null)) as RpcRequest | RpcRequest[] | null
  if (!body)
    return NextResponse.json(
      { jsonrpc: '2.0', id: null, error: { code: -32700, message: 'Parse error' } },
      { status: 400, headers: securityHeaders },
    )
  const responses = (Array.isArray(body) ? body : [body])
    .map(handleMcp)
    .filter((value) => value !== null)
  if (responses.length === 0)
    return new NextResponse(null, { status: 202, headers: securityHeaders })
  return NextResponse.json(Array.isArray(body) ? responses : responses[0], {
    headers: { ...securityHeaders, 'MCP-Protocol-Version': '2025-06-18' },
  })
}

export async function GET() {
  return NextResponse.json(
    { error: 'Use an authenticated JSON-RPC POST request.' },
    { status: 405, headers: { ...securityHeaders, Allow: 'POST' } },
  )
}
