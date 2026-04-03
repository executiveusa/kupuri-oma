import { getTranslations } from 'next-intl/server'
import { FolderOpen, Activity, Sparkles, TrendingUp } from 'lucide-react'
import { Card } from '@kupuri/design-system'

interface DashboardPageProps {
  params: Promise<{ locale: string }>
}

// ── Stat card ─────────────────────────────────────────────────────────────────

interface StatCardProps {
  label: string
  value: string | number
  subtext?: string
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: 'true' }>
}

function StatCard({ label, value, subtext, icon: Icon }: StatCardProps) {
  return (
    <Card className="flex items-start gap-4 p-6">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-neutral-800">
        <Icon className="h-5 w-5 text-violet-400" aria-hidden="true" />
      </div>
      <div>
        <p className="text-2xl font-bold text-neutral-50 tabular-nums">{value}</p>
        <p className="mt-0.5 text-sm font-medium text-neutral-300">{label}</p>
        {subtext && <p className="mt-1 text-xs text-neutral-500">{subtext}</p>}
      </div>
    </Card>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────

function EmptyProjects({ message, cta }: { message: string; cta: string }) {
  return (
    <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-neutral-800 px-8 py-16 text-center">
      <FolderOpen className="h-10 w-10 text-neutral-700" aria-hidden="true" />
      <p className="text-sm text-neutral-500">{message}</p>
      <a
        href="#"
        className="inline-flex h-9 items-center rounded-lg bg-violet-600 px-4 text-sm font-medium text-white transition-colors hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-neutral-950"
      >
        {cta}
      </a>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'dashboard' })

  const stats: StatCardProps[] = [
    { label: t('stats.projects'), value: 0, icon: FolderOpen },
    { label: t('stats.buildRuns'), value: 0, subtext: t('stats.thisMonth'), icon: Activity },
    { label: t('stats.agentTasks'), value: 0, icon: Sparkles },
    { label: t('stats.architectureScore'), value: '—', subtext: 'SYNTHIA', icon: TrendingUp },
  ]

  return (
    <div className="flex flex-col overflow-auto">
      {/* Top bar */}
      <header className="flex h-14 items-center border-b border-neutral-800 px-6">
        <h1 className="text-base font-semibold text-neutral-100">{t('home.heading')}</h1>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Stats */}
        <section aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">{t('home.statsHeading')}</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>
        </section>

        {/* Recent projects */}
        <section className="mt-8" aria-labelledby="projects-heading">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="projects-heading" className="text-sm font-medium text-neutral-300">
              {t('home.recentProjects')}
            </h2>
            <a href="#" className="text-xs text-violet-400 hover:text-violet-300">
              {t('home.viewAll')}
            </a>
          </div>
          <EmptyProjects
            message={t('home.noProjectsMessage')}
            cta={t('home.createFirstProject')}
          />
        </section>

        {/* Recent builds */}
        <section className="mt-8" aria-labelledby="builds-heading">
          <div className="mb-4 flex items-center justify-between">
            <h2 id="builds-heading" className="text-sm font-medium text-neutral-300">
              {t('home.recentBuilds')}
            </h2>
          </div>
          <div className="rounded-xl border border-neutral-800 bg-neutral-900 divide-y divide-neutral-800">
            <div className="px-4 py-8 text-center">
              <p className="text-sm text-neutral-500">{t('home.noBuildsMessage')}</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
