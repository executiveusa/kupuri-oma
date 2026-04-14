import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import {
  Shirt,
  Flower2,
  TreePine,
  GraduationCap,
  Swords,
  Gamepad2,
  ChevronRight,
  Lock,
  Sparkles,
} from 'lucide-react'
import { Card } from '@kupuri/design-system'

interface CinemaPageProps {
  params: Promise<{ locale: string }>
}

// ── Niche definitions ──────────────────────────────────────────────────────────

type NicheId = 'fashion' | 'spa' | 'ecotourism' | 'education' | 'anime' | 'game_dev'

interface NicheCard {
  id: NicheId
  path: string
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: 'true' }>
  active: boolean
  accentClass: string
  iconBgClass: string
}

const NICHES: NicheCard[] = [
  {
    id: 'fashion',
    path: 'fashion',
    icon: Shirt,
    active: true,
    accentClass: 'border-violet-800/40',
    iconBgClass: 'bg-violet-900/40 text-violet-400',
  },
  {
    id: 'spa',
    path: 'spa',
    icon: Flower2,
    active: true,
    accentClass: 'border-emerald-800/40',
    iconBgClass: 'bg-emerald-900/40 text-emerald-400',
  },
  {
    id: 'ecotourism',
    path: 'ecotourism',
    icon: TreePine,
    active: true,
    accentClass: 'border-teal-800/40',
    iconBgClass: 'bg-teal-900/40 text-teal-400',
  },
  {
    id: 'education',
    path: 'coming-soon?niche=education',
    icon: GraduationCap,
    active: false,
    accentClass: 'border-neutral-800',
    iconBgClass: 'bg-neutral-800 text-neutral-500',
  },
  {
    id: 'anime',
    path: 'coming-soon?niche=anime',
    icon: Swords,
    active: false,
    accentClass: 'border-neutral-800',
    iconBgClass: 'bg-neutral-800 text-neutral-500',
  },
  {
    id: 'game_dev',
    path: 'coming-soon?niche=game-dev',
    icon: Gamepad2,
    active: false,
    accentClass: 'border-neutral-800',
    iconBgClass: 'bg-neutral-800 text-neutral-500',
  },
]

// ── Active niche card ──────────────────────────────────────────────────────────

interface ActiveCardProps {
  niche: NicheCard
  name: string
  description: string
  statsLabel: string
  locale: string
  activeBadge: string
}

function ActiveNicheCard({
  niche,
  name,
  description,
  statsLabel,
  locale,
  activeBadge,
}: ActiveCardProps) {
  const Icon = niche.icon
  return (
    <Link
      href={`/${locale}/dashboard/cinema/${niche.path}`}
      className={`group flex flex-col gap-4 rounded-xl border ${niche.accentClass} bg-neutral-900 p-6 transition-colors hover:border-neutral-700 hover:bg-neutral-800/80`}
      aria-label={name}
    >
      <div className="flex items-start justify-between">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg ${niche.iconBgClass}`}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <span className="inline-flex items-center gap-1 rounded-full bg-neutral-800 px-2 py-0.5 text-xs font-medium text-neutral-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
          {activeBadge}
        </span>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-neutral-100 group-hover:text-white">{name}</h3>
        <p className="mt-1 text-xs text-neutral-500">{description}</p>
      </div>

      <div className="mt-auto flex items-center justify-between">
        <span className="text-xs text-neutral-600">{statsLabel}</span>
        <ChevronRight
          className="h-4 w-4 text-neutral-600 transition-transform group-hover:translate-x-0.5 group-hover:text-neutral-400"
          aria-hidden="true"
        />
      </div>
    </Link>
  )
}

// ── Coming-soon niche card ─────────────────────────────────────────────────────

interface ComingSoonCardProps {
  niche: NicheCard
  name: string
  description: string
  locale: string
  inviteBadge: string
}

function ComingSoonNicheCard({
  niche,
  name,
  description,
  locale,
  inviteBadge,
}: ComingSoonCardProps) {
  const Icon = niche.icon
  return (
    <Link
      href={`/${locale}/dashboard/cinema/${niche.path}`}
      className="group flex flex-col gap-4 rounded-xl border border-neutral-800 bg-neutral-950 p-6 opacity-70 transition-opacity hover:opacity-100"
      aria-label={`${name} — ${inviteBadge}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-neutral-800 text-neutral-600">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-700 px-2 py-0.5 text-xs font-medium text-neutral-500">
          <Lock className="h-2.5 w-2.5" aria-hidden="true" />
          {inviteBadge}
        </span>
      </div>

      <div>
        <h3 className="text-sm font-semibold text-neutral-400 group-hover:text-neutral-300">
          {name}
        </h3>
        <p className="mt-1 text-xs text-neutral-600">{description}</p>
      </div>

      <div className="mt-auto flex items-center justify-end">
        <ChevronRight className="h-4 w-4 text-neutral-700" aria-hidden="true" />
      </div>
    </Link>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export async function generateMetadata({ params }: CinemaPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'cinema' })
  return { title: t('title') }
}

export default async function CinemaPage({ params }: CinemaPageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'cinema' })

  return (
    <div className="flex flex-col overflow-auto">
      {/* Top bar */}
      <header className="flex h-14 items-center gap-3 border-b border-neutral-800 px-6">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600/20">
          <Sparkles className="h-4 w-4 text-violet-400" aria-hidden="true" />
        </div>
        <div>
          <h1 className="text-sm font-semibold text-neutral-100">{t('title')}</h1>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Intro */}
        <div className="mb-8">
          <p className="max-w-xl text-sm text-neutral-400">{t('subtitle')}</p>
        </div>

        {/* Niches grid */}
        <section aria-labelledby="niches-heading">
          <div className="mb-4 flex items-baseline justify-between">
            <div>
              <h2
                id="niches-heading"
                className="text-sm font-semibold text-neutral-200"
              >
                {t('niches_heading')}
              </h2>
              <p className="mt-0.5 text-xs text-neutral-500">{t('niches_subheading')}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {NICHES.map((niche) => {
              const nicheKey = niche.id as keyof ReturnType<typeof t>
              const nicheName = t(`niches.${nicheKey}.name` as Parameters<typeof t>[0])
              const nicheDescription = t(
                `niches.${nicheKey}.description` as Parameters<typeof t>[0],
              )

              if (niche.active) {
                return (
                  <ActiveNicheCard
                    key={niche.id}
                    niche={niche}
                    name={nicheName}
                    description={nicheDescription}
                    statsLabel={t(`niches.${nicheKey}.stats_label` as Parameters<typeof t>[0])}
                    locale={locale}
                    activeBadge={t('active_badge')}
                  />
                )
              }

              return (
                <ComingSoonNicheCard
                  key={niche.id}
                  niche={niche}
                  name={nicheName}
                  description={nicheDescription}
                  locale={locale}
                  inviteBadge={t('invite_only_badge')}
                />
              )
            })}
          </div>
        </section>

        {/* Quality guarantee */}
        <div className="mt-10 rounded-xl border border-neutral-800 bg-neutral-950 px-6 py-4">
          <p className="text-center text-xs text-neutral-600">{t('quality_minimum')}</p>
        </div>
      </div>
    </div>
  )
}
