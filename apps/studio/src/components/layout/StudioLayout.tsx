'use client'

import { useState, type ReactNode } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { cn } from '@kupuri/design-system'
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  Settings,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Layers,
  Sparkles,
  Activity,
  BookOpen,
  Film,
} from 'lucide-react'

interface StudioLayoutProps {
  children: ReactNode
  locale: string
}

const NAV_ITEMS = [
  { id: 'dashboard', icon: LayoutDashboard, href: 'dashboard', labelKey: 'nav.dashboard' },
  { id: 'cinema', icon: Film, href: 'dashboard/cinema', labelKey: 'nav.cinema' },
  { id: 'projects', icon: FolderOpen, href: 'dashboard/projects', labelKey: 'nav.projects' },
  { id: 'templates', icon: Layers, href: 'dashboard/templates', labelKey: 'nav.templates' },
  { id: 'community', icon: Users, href: 'dashboard/community', labelKey: 'nav.community' },
  { id: 'builds', icon: Activity, href: 'dashboard/builds', labelKey: 'nav.builds' },
  { id: 'agents', icon: Sparkles, href: 'dashboard/agents', labelKey: 'nav.agents' },
] as const

const BOTTOM_NAV_ITEMS = [
  { id: 'docs', icon: BookOpen, href: 'dashboard/docs', labelKey: 'nav.docs' },
  { id: 'billing', icon: CreditCard, href: 'dashboard/billing', labelKey: 'nav.billing' },
  { id: 'settings', icon: Settings, href: 'dashboard/settings', labelKey: 'nav.settings' },
] as const

export function StudioLayout({ children, locale }: StudioLayoutProps) {
  const t = useTranslations()
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <aside
        className={cn(
          'flex flex-col border-r border-neutral-800 bg-neutral-950 transition-all duration-200',
          collapsed ? 'w-16' : 'w-60'
        )}
      >
        {/* Logo / Brand */}
        <div className="flex h-14 items-center border-b border-neutral-800 px-4">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded bg-violet-600" aria-hidden="true" />
              <span className="text-sm font-semibold text-neutral-100">Kupuri Studio</span>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto h-6 w-6 rounded bg-violet-600" aria-hidden="true" />
          )}
        </div>

        {/* Primary nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3" aria-label={t('nav.primary')}>
          <ul className="space-y-0.5" role="list">
            {NAV_ITEMS.map(({ id, icon: Icon, href, labelKey }) => {
              const fullHref = `/${locale}/${href}`
              const isActive = pathname === fullHref || pathname.startsWith(`${fullHref}/`)
              return (
                <li key={id}>
                  <Link
                    href={fullHref}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-violet-600/15 text-violet-400'
                        : 'text-neutral-400 hover:bg-neutral-800 hover:text-neutral-100'
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon
                      className={cn('h-4 w-4 shrink-0', isActive ? 'text-violet-400' : '')}
                      aria-hidden="true"
                    />
                    {!collapsed && (
                      <span className="truncate">{t(labelKey as Parameters<typeof t>[0])}</span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Bottom nav */}
        <div className="border-t border-neutral-800 px-2 py-3">
          <ul className="space-y-0.5" role="list">
            {BOTTOM_NAV_ITEMS.map(({ id, icon: Icon, href, labelKey }) => {
              const fullHref = `/${locale}/${href}`
              const isActive = pathname === fullHref
              return (
                <li key={id}>
                  <Link
                    href={fullHref}
                    className={cn(
                      'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                      isActive
                        ? 'bg-neutral-800 text-neutral-100'
                        : 'text-neutral-500 hover:bg-neutral-800 hover:text-neutral-300'
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
                    {!collapsed && (
                      <span className="truncate">{t(labelKey as Parameters<typeof t>[0])}</span>
                    )}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="flex h-10 items-center justify-center border-t border-neutral-800 text-neutral-500 transition-colors hover:bg-neutral-900 hover:text-neutral-300"
          aria-label={collapsed ? t('nav.expandSidebar') : t('nav.collapseSidebar')}
        >
          {collapsed ? (
            <ChevronRight className="h-4 w-4" aria-hidden="true" />
          ) : (
            <ChevronLeft className="h-4 w-4" aria-hidden="true" />
          )}
        </button>
      </aside>

      {/* Main content area */}
      <main id="main" className="flex flex-1 flex-col overflow-hidden">
        {children}
      </main>
    </div>
  )
}
