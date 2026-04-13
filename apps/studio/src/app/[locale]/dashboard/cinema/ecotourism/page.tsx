import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import {
  TreePine,
  ArrowLeft,
  Video,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  MapPin,
} from 'lucide-react'
import { Card } from '@kupuri/design-system'
import { NicheStatCard } from '@/components/cinema/NicheStatCard'
import { NicheEmptyState } from '@/components/cinema/NicheEmptyState'

interface EcotourismPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: EcotourismPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'cinema' })
  return { title: `${t('niches.ecotourism.name')} — ${t('title')}` }
}

export default async function EcotourismPage({ params }: EcotourismPageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'cinema' })

  const stats = [
    { label: t('total_videos'), value: 0, icon: Video },
    { label: t('total_characters'), value: 0, icon: Users },
    { label: t('total_earnings'), value: '$0', icon: DollarSign },
    { label: t('quality_score'), value: '—', icon: TrendingUp },
  ]

  const affiliates = [
    { name: 'Booking.com', rate: '5%', category: 'Viajes' },
    { name: 'Airbnb', rate: '4%', category: 'Experiencias' },
    { name: 'ToursByLocals', rate: '10%', category: 'Tours' },
    { name: 'GetYourGuide', rate: '8%', category: 'Actividades' },
  ]

  return (
    <div className="flex flex-col overflow-auto">
      {/* Top bar */}
      <header className="flex h-14 items-center gap-4 border-b border-neutral-800 px-6">
        <Link
          href={`/${locale}/dashboard/cinema`}
          className="flex items-center gap-1.5 text-xs text-neutral-500 transition-colors hover:text-neutral-300"
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          Cinema Studio
        </Link>
        <span className="text-neutral-800" aria-hidden="true">/</span>
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-teal-900/40">
            <TreePine className="h-3.5 w-3.5 text-teal-400" aria-hidden="true" />
          </div>
          <h1 className="text-sm font-semibold text-neutral-100">
            {t('niches.ecotourism.name')}
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href={`/${locale}/dashboard/cinema/ecotourism/characters/new`}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-neutral-700 px-3 text-xs font-medium text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-neutral-100"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            {t('new_character')}
          </Link>
          <Link
            href={`/${locale}/dashboard/cinema/ecotourism/generate`}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-teal-700 px-3 text-xs font-medium text-white transition-colors hover:bg-teal-600"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            {t('new_video')}
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <p className="mb-6 max-w-xl text-sm text-neutral-500">
          {t('niches.ecotourism.description')}
        </p>

        {/* Stats */}
        <section aria-labelledby="eco-stats-heading">
          <h2 id="eco-stats-heading" className="sr-only">Estadísticas</h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
              <NicheStatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
                accentClass="text-teal-400"
              />
            ))}
          </div>
        </section>

        {/* Main grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <section className="lg:col-span-2" aria-labelledby="eco-videos-heading">
            <div className="mb-4 flex items-center justify-between">
              <h2 id="eco-videos-heading" className="text-sm font-medium text-neutral-300">
                {t('recent_videos')}
              </h2>
              <Link
                href={`/${locale}/dashboard/cinema/ecotourism/videos`}
                className="text-xs text-teal-400 hover:text-teal-300"
              >
                {t('view_videos')}
              </Link>
            </div>
            <NicheEmptyState
              message={t('no_videos')}
              hint={t('no_videos_hint')}
              cta={t('create_first_video')}
              href={`/${locale}/dashboard/cinema/ecotourism/generate`}
              accentClass="bg-teal-700 hover:bg-teal-600"
            />
          </section>

          <div className="flex flex-col gap-6">
            <section aria-labelledby="eco-characters-heading">
              <div className="mb-4 flex items-center justify-between">
                <h2 id="eco-characters-heading" className="text-sm font-medium text-neutral-300">
                  {t('recent_characters')}
                </h2>
                <Link
                  href={`/${locale}/dashboard/cinema/ecotourism/characters`}
                  className="text-xs text-teal-400 hover:text-teal-300"
                >
                  {t('view_characters')}
                </Link>
              </div>
              <NicheEmptyState
                message={t('no_characters')}
                hint={t('no_characters_hint')}
                cta={t('create_first_character')}
                href={`/${locale}/dashboard/cinema/ecotourism/characters/new`}
                compact
                accentClass="bg-teal-700 hover:bg-teal-600"
              />
            </section>

            <section aria-labelledby="eco-affiliate-heading">
              <div className="mb-3 flex items-center justify-between">
                <h2 id="eco-affiliate-heading" className="text-sm font-medium text-neutral-300">
                  {t('affiliate_summary')}
                </h2>
                <Link
                  href={`/${locale}/dashboard/cinema/ecotourism/affiliate`}
                  className="text-xs text-teal-400 hover:text-teal-300"
                >
                  {t('view_affiliate')}
                </Link>
              </div>
              <Card className="p-0 overflow-hidden">
                <ul className="divide-y divide-neutral-800" role="list">
                  {affiliates.map((affiliate) => (
                    <li key={affiliate.name} className="flex items-center justify-between px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-6 w-6 items-center justify-center rounded bg-neutral-800">
                          <MapPin className="h-3 w-3 text-neutral-500" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-neutral-300">{affiliate.name}</p>
                          <p className="text-xs text-neutral-600">{affiliate.category}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-teal-400">
                        {affiliate.rate}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </section>
          </div>
        </div>

        <div className="mt-8 flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 px-6 py-4">
          <div>
            <p className="text-xs font-medium text-neutral-400">{t('generation_cost')}</p>
            <p className="text-xs text-neutral-600">
              ~$3.10 USD {t('generation_time')}: {t('generation_minutes', { min: 8, max: 15 })}
            </p>
          </div>
          <p className="text-xs text-neutral-600">{t('quality_minimum')}</p>
        </div>
      </div>
    </div>
  )
}
