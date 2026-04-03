'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Plus, ArrowRight, Zap, Users, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'

interface DashboardHomeProps {
  locale: string
}

export function DashboardHome({ locale }: DashboardHomeProps) {
  const t = useTranslations('dashboard')
  const localePath = (path: string) => `/${locale}${path}`

  const stats = [
    { label: 'Proyectos activos', value: '0', icon: TrendingUp, trend: null },
    { label: 'Comunidad', value: '12.4K', icon: Users, trend: '+5%' },
    { label: 'Builds este mes', value: '0', icon: Zap, trend: null },
  ]

  return (
    <div className="max-w-5xl">
      {/* Welcome */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <h1 className="text-2xl font-bold text-neutral-100">{t('title')}</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Bienvenido a tu espacio creativo.
        </p>
      </motion.div>

      {/* Stats row */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat, i) => {
          const Icon = stat.icon
          return (
            <motion.div
              key={stat.label}
              className="rounded-xl border border-neutral-800 bg-neutral-900 p-5"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35, delay: i * 0.06 }}
            >
              <div className="mb-3 flex items-center justify-between">
                <p className="text-xs text-neutral-500">{stat.label}</p>
                <Icon size={14} className="text-neutral-700" aria-hidden="true" />
              </div>
              <div className="flex items-end gap-2">
                <p className="text-2xl font-semibold text-neutral-100">{stat.value}</p>
                {stat.trend && (
                  <p className="mb-0.5 text-xs text-green-400">{stat.trend}</p>
                )}
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Projects section */}
      <motion.div
        className="rounded-xl border border-neutral-800 bg-neutral-900"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.2 }}
      >
        <div className="flex items-center justify-between border-b border-neutral-800 px-5 py-4">
          <h2 className="text-sm font-semibold text-neutral-100">{t('projects')}</h2>
          <Link
            href={localePath('/community')}
            className="inline-flex items-center gap-1 text-xs text-neutral-500 transition-colors hover:text-neutral-300"
          >
            Ver comunidad <ArrowRight size={12} aria-hidden="true" />
          </Link>
        </div>

        {/* Empty state */}
        <div className="px-5 py-16 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-neutral-800">
            <Plus size={20} className="text-neutral-500" aria-hidden="true" />
          </div>
          <p className="text-sm font-medium text-neutral-300">{t('no_projects')}</p>
          <p className="mt-1 text-xs text-neutral-600">{t('no_projects_hint')}</p>
          <div className="mt-6 flex justify-center gap-3">
            <Link
              href={localePath('/dashboard/projects/new')}
              className="inline-flex items-center gap-1.5 rounded-lg bg-violet-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-violet-500"
            >
              <Plus size={13} aria-hidden="true" />
              {t('new_project')}
            </Link>
            <Link
              href={localePath('/community')}
              className="inline-flex items-center rounded-lg border border-neutral-700 px-4 py-2 text-xs text-neutral-400 transition-colors hover:bg-neutral-800"
            >
              Explorar comunidad
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Recent builds */}
      <motion.div
        className="mt-4 rounded-xl border border-neutral-800 bg-neutral-900 px-5 py-4"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.25 }}
      >
        <p className="text-sm font-semibold text-neutral-100">{t('recent_builds')}</p>
        <p className="mt-6 text-center text-xs text-neutral-700 pb-6">
          Sin construcciones recientes
        </p>
      </motion.div>
    </div>
  )
}
