'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  LayoutDashboard,
  FolderOpen,
  Users,
  CreditCard,
  Settings,
  Sparkles,
  LogOut,
} from 'lucide-react'
import { cn } from '@kupuri/design-system'

interface DashboardLayoutProps {
  children: React.ReactNode
  locale: string
}

const NAV_ITEMS = [
  { key: 'dashboard', href: '/dashboard', icon: LayoutDashboard },
  { key: 'projects', href: '/dashboard/projects', icon: FolderOpen },
  { key: 'community', href: '/dashboard/community', icon: Users },
  { key: 'billing', href: '/dashboard/billing', icon: CreditCard },
  { key: 'settings', href: '/dashboard/settings', icon: Settings },
] as const

export function DashboardLayout({ children, locale }: DashboardLayoutProps) {
  const t = useTranslations('dashboard')
  const pathname = usePathname()
  const localePath = (path: string) => `/${locale}${path}`

  return (
    <div className="flex min-h-screen bg-neutral-950">
      {/* Sidebar — COCKPIT mode: dense, slate+violet, Linear-inspired */}
      <nav
        className="fixed inset-y-0 left-0 z-[200] hidden w-[240px] flex-col border-r border-neutral-800 bg-neutral-950 md:flex"
        aria-label="Navegación del panel"
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 border-b border-neutral-800 px-4 py-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600">
            <span className="text-xs font-bold text-white">K</span>
          </div>
          <span className="text-sm font-semibold text-neutral-100">Kupuri OMA</span>
        </div>

        {/* New project CTA */}
        <div className="border-b border-neutral-800 px-3 py-3">
          <Link
            href={localePath('/dashboard/projects/new')}
            className="flex items-center gap-2 rounded-lg bg-violet-600 px-3 py-2 text-xs font-medium text-white transition-colors hover:bg-violet-500"
          >
            <Sparkles size={13} aria-hidden="true" />
            {t('new_project')}
          </Link>
        </div>

        {/* Nav items */}
        <div className="flex-1 overflow-y-auto px-2 py-3">
          <ul className="space-y-0.5" role="list">
            {NAV_ITEMS.map(({ key, href, icon: Icon }) => {
              const isActive = pathname === localePath(href)
              return (
                <li key={key}>
                  <Link
                    href={localePath(href)}
                    className={cn(
                      'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors duration-150',
                      isActive
                        ? 'bg-neutral-800 text-neutral-100'
                        : 'text-neutral-500 hover:bg-neutral-900 hover:text-neutral-200',
                    )}
                    aria-current={isActive ? 'page' : undefined}
                  >
                    <Icon size={15} aria-hidden="true" />
                    {t(key)}
                  </Link>
                </li>
              )
            })}
          </ul>
        </div>

        {/* User footer */}
        <div className="border-t border-neutral-800 p-3">
          <div className="flex items-center gap-2.5 rounded-md px-2 py-2">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-neutral-800 text-xs font-semibold text-neutral-300">
              U
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-medium text-neutral-200">Usuario</p>
              <p className="truncate text-xs text-neutral-600">usuario@email.com</p>
            </div>
          </div>
          <Link
            href={localePath('/login')}
            className="mt-1 flex items-center gap-2 rounded-md px-3 py-2 text-xs text-neutral-600 transition-colors hover:bg-neutral-900 hover:text-neutral-400"
          >
            <LogOut size={13} aria-hidden="true" />
            Cerrar sesión
          </Link>
        </div>
      </nav>

      {/* Main content area */}
      <main className="flex-1 md:ml-[240px]">
        {/* Mobile top bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 px-6 py-4 md:hidden">
          <span className="text-sm font-semibold text-neutral-100">Kupuri OMA</span>
        </div>
        <div className="px-6 py-8">{children}</div>
      </main>
    </div>
  )
}
