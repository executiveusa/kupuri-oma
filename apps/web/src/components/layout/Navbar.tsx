'use client'

import * as React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Menu, X } from 'lucide-react'
import { cn } from '@kupuri/design-system'

interface NavbarProps {
  locale: string
}

const NAV_LINKS = [
  { key: 'templates', href: '/templates' },
  { key: 'pricing', href: '/pricing' },
  { key: 'community', href: '/community' },
  { key: 'studio', href: '/studio' },
] as const

export function Navbar({ locale }: NavbarProps) {
  const t = useTranslations('nav')
  const [mobileOpen, setMobileOpen] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)

  React.useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const localePath = (path: string) => `/${locale}${path}`

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-[200] transition-colors duration-200',
        scrolled
          ? 'border-b border-neutral-800/80 bg-neutral-950/90 backdrop-blur-sm'
          : 'bg-transparent',
      )}
    >
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4"
        aria-label="Navegación principal"
      >
        {/* Logo */}
        <Link
          href={localePath('/')}
          className="flex items-center gap-2.5 font-bold text-neutral-100 transition-opacity hover:opacity-80"
          aria-label="Kupuri OMA — Inicio"
        >
          <KupuriLogo />
          <span className="text-sm font-semibold tracking-wide">Kupuri OMA</span>
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 md:flex" role="list">
          {NAV_LINKS.map(({ key, href }) => (
            <li key={key}>
              <Link
                href={localePath(href)}
                className="rounded-md px-3 py-2 text-sm text-neutral-400 transition-colors duration-150 hover:bg-neutral-800 hover:text-neutral-100"
              >
                {t(key)}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop auth actions */}
        <div className="hidden items-center gap-3 md:flex">
          <LocaleSwitcher currentLocale={locale} />
          <Link
            href={localePath('/login')}
            className="text-sm text-neutral-400 transition-colors hover:text-neutral-100"
          >
            {t('login')}
          </Link>
          <Link
            href={localePath('/register')}
            className="inline-flex h-9 items-center rounded-lg bg-violet-600 px-4 text-sm font-medium text-white transition-colors duration-150 hover:bg-violet-500"
          >
            {t('register')}
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-100 md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-expanded={mobileOpen}
          aria-controls="mobile-nav"
          aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {mobileOpen ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {/* Mobile nav panel */}
      {mobileOpen && (
        <div
          id="mobile-nav"
          className="border-t border-neutral-800 bg-neutral-950 px-6 pb-6 pt-4 md:hidden"
        >
          <ul className="space-y-1" role="list">
            {NAV_LINKS.map(({ key, href }) => (
              <li key={key}>
                <Link
                  href={localePath(href)}
                  className="block rounded-md px-3 py-2.5 text-sm text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-neutral-100"
                  onClick={() => setMobileOpen(false)}
                >
                  {t(key)}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex flex-col gap-2 border-t border-neutral-800 pt-4">
            {/* Language toggle in mobile menu */}
            <LocaleSwitcher currentLocale={locale} inMobile />
            <Link
              href={localePath('/login')}
              className="block rounded-lg border border-neutral-700 px-4 py-2.5 text-center text-sm text-neutral-300 transition-colors hover:bg-neutral-800"
              onClick={() => setMobileOpen(false)}
            >
              {t('login')}
            </Link>
            <Link
              href={localePath('/register')}
              className="block rounded-lg bg-violet-600 px-4 py-2.5 text-center text-sm font-medium text-white transition-colors hover:bg-violet-500"
              onClick={() => setMobileOpen(false)}
            >
              {t('register')}
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

// ─── Locale switcher ─────────────────────────────────────────────────────────

function LocaleSwitcher({
  currentLocale,
  inMobile = false,
}: {
  currentLocale: string
  inMobile?: boolean
}) {
  const otherLocale = currentLocale === 'es-MX' ? 'en' : 'es-MX'
  const currentFlag = currentLocale === 'es-MX' ? '🇲🇽' : '🇺🇸'
  const otherFlag = currentLocale === 'es-MX' ? '🇺🇸' : '🇲🇽'
  const otherLabel = currentLocale === 'es-MX' ? 'English' : 'Español'
  const otherShort = currentLocale === 'es-MX' ? 'EN' : 'ES'

  if (inMobile) {
    return (
      <Link
        href={`/${otherLocale}`}
        className="flex items-center justify-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-4 py-2.5 text-sm text-neutral-300 transition-colors hover:bg-neutral-800"
        aria-label={`Switch to ${otherLabel}`}
      >
        <span aria-hidden="true">{otherFlag}</span>
        <span>{otherLabel}</span>
      </Link>
    )
  }

  return (
    <Link
      href={`/${otherLocale}`}
      className="inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-neutral-400 transition-colors hover:bg-neutral-800 hover:text-neutral-200"
      aria-label={`Switch to ${otherLabel}`}
    >
      <span aria-hidden="true">{otherFlag}</span>
      <span>{otherShort}</span>
    </Link>
  )
}

// ─── Logo mark ───────────────────────────────────────────────────────────────

function KupuriLogo() {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect width="24" height="24" rx="6" fill="oklch(50% 0.22 290)" />
      <path
        d="M7 7L12 12L7 17M13 12H17"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
