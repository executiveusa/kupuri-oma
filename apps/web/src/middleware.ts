import createMiddleware from 'next-intl/middleware'
import { LOCALES, DEFAULT_LOCALE } from '@kupuri/localization'

export default createMiddleware({
  locales: LOCALES,
  defaultLocale: DEFAULT_LOCALE,
  localePrefix: 'always',
  localeDetection: true,
})

export const config = {
  matcher: [
    // Match all paths except: api, _next/static, _next/image, favicon, public files
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
