import createMiddleware from 'next-intl/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { LOCALES, DEFAULT_LOCALE } from '@kupuri/localization'

const intlMiddleware = createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always',
})

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow health check without auth
  if (pathname === '/api/health') {
    return NextResponse.next()
  }

  // All studio routes require authentication (enforced via layout)
  return intlMiddleware(request)
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)']
}
