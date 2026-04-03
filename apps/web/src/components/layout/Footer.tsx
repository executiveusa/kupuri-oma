import Link from 'next/link'
import { useTranslations } from 'next-intl'

interface FooterProps {
  locale: string
}

export function Footer({ locale }: FooterProps) {
  const t = useTranslations('nav')
  const localePath = (path: string) => `/${locale}${path}`

  return (
    <footer className="border-t border-neutral-800 bg-neutral-950">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <p className="text-sm font-semibold text-neutral-100">Kupuri OMA</p>
            <p className="mt-2 text-xs text-neutral-500 leading-relaxed">
              {t('footer_tagline')}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Producto</p>
            <ul className="mt-3 space-y-2">
              {[
                { label: t('templates'), href: '/templates' },
                { label: t('community'), href: '/community' },
                { label: t('studio'), href: '/studio' },
                { label: t('pricing'), href: '/pricing' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={localePath(href)}
                    className="text-sm text-neutral-400 transition-colors hover:text-neutral-100"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Recursos</p>
            <ul className="mt-3 space-y-2">
              {[
                { label: 'Documentación', href: '/docs' },
                { label: 'API Reference', href: '/docs/api' },
                { label: 'CLI', href: '/docs/cli' },
                { label: t('faq'), href: '/faq' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={localePath(href)}
                    className="text-sm text-neutral-400 transition-colors hover:text-neutral-100"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Legal</p>
            <ul className="mt-3 space-y-2">
              {[
                { label: 'Términos de uso', href: '/terms' },
                { label: 'Privacidad', href: '/privacy' },
              ].map(({ label, href }) => (
                <li key={href}>
                  <Link
                    href={localePath(href)}
                    className="text-sm text-neutral-400 transition-colors hover:text-neutral-100"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-neutral-800 pt-8 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-neutral-600">
            © {new Date().getFullYear()} Kupuri OMA. Todos los derechos reservados.
          </p>
          <p className="text-xs text-neutral-600">{t('made_with_love')}</p>
        </div>
      </div>
    </footer>
  )
}
