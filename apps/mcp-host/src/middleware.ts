import createMiddleware from 'next-intl/middleware'
import { routing } from './routing'

export default createMiddleware(routing)

export const config = {
  matcher: [
    // Match all paths except: api, _next/static, _next/image, favicon, public files
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
