import type { Metadata } from 'next'
import Link from 'next/link'
import { getTranslations } from 'next-intl/server'
import {
  Shirt,
  ArrowLeft,
  Video,
  Users,
  DollarSign,
  TrendingUp,
  Plus,
  ShoppingBag,
} from 'lucide-react'
import { Card } from '@kupuri/design-system'
import { NicheStatCard } from '@/components/cinema/NicheStatCard'
import { NicheEmptyState } from '@/components/cinema/NicheEmptyState'

interface FashionPageProps {
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: FashionPageProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'cinema' })
  return { title: `${t('niches.fashion.name')} — ${t('title')}` }
}

export default async function FashionPage({ params }: FashionPageProps) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'cinema' })

  const stats = [
    { label: t('total_videos'), value: 0, icon: Video },
    { label: t('total_characters'), value: 0, icon: Users },
    { label: t('total_earnings'), value: '$0', icon: DollarSign },
    { label: t('quality_score'), value: '—', icon: TrendingUp },
  ]

  const affiliates = [
    { name: 'Shopify', rate: '5%', category: 'E-commerce' },
    { name: 'Amazon', rate: '4%', category: 'E-commerce' },
    { name: 'Zalora', rate: '3%', category: 'Moda' },
    { name: 'Mercado Libre', rate: '3%', category: 'E-commerce' },
    { name: 'ASOS', rate: '2%', category: 'Moda' },
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
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-violet-900/40">
            <Shirt className="h-3.5 w-3.5 text-violet-400" aria-hidden="true" />
          </div>
          <h1 className="text-sm font-semibold text-neutral-100">
            {t('niches.fashion.name')}
          </h1>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href={`/${locale}/dashboard/cinema/fashion/characters/new`}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-neutral-700 px-3 text-xs font-medium text-neutral-300 transition-colors hover:bg-neutral-800 hover:text-neutral-100"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            {t('new_character')}
          </Link>
          <Link
            href={`/${locale}/dashboard/cinema/fashion/generate`}
            className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-violet-600 px-3 text-xs font-medium text-white transition-colors hover:bg-violet-500"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            {t('new_video')}
          </Link>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Description */}
        <p className="mb-6 max-w-xl text-sm text-neutral-500">
          {t('niches.fashion.description')}
        </p>

        {/* Stats */}
        <section aria-labelledby="fashion-stats-heading">
          <h2 id="fashion-stats-heading" className="sr-only">
            Estadísticas
          </h2>
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {stats.map((stat) => (
              <NicheStatCard
                key={stat.label}
                label={stat.label}
                value={stat.value}
                icon={stat.icon}
              />
            ))}
          </div>
        </section>

        {/* Main grid */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Videos — 2/3 width */}
          <section
            className="lg:col-span-2"
            aria-labelledby="fashion-videos-heading"
          >
            <div className="mb-4 flex items-center justify-between">
              <h2
                id="fashion-videos-heading"
                className="text-sm font-medium text-neutral-300"
              >
                {t('recent_videos')}
              </h2>
              <Link
                href={`/${locale}/dashboard/cinema/fashion/videos`}
                className="text-xs text-violet-400 hover:text-violet-300"
              >
                {t('view_videos')}
              </Link>
            </div>
            <NicheEmptyState
              message={t('no_videos')}
              hint={t('no_videos_hint')}
              cta={t('create_first_video')}
              href={`/${locale}/dashboard/cinema/fashion/generate`}
            />
          </section>

          {/* Right column */}
          <div className="flex flex-col gap-6">
            {/* Characters */}
            <section aria-labelledby="fashion-characters-heading">
              <div className="mb-4 flex items-center justify-between">
                <h2
                  id="fashion-characters-heading"
                  className="text-sm font-medium text-neutral-300"
                >
                  {t('recent_characters')}
                </h2>
                <Link
                  href={`/${locale}/dashboard/cinema/fashion/characters`}
                  className="text-xs text-violet-400 hover:text-violet-300"
                >
                  {t('view_characters')}
                </Link>
              </div>
              <NicheEmptyState
                message={t('no_characters')}
                hint={t('no_characters_hint')}
                cta={t('create_first_character')}
                href={`/${locale}/dashboard/cinema/fashion/characters/new`}
                compact
              />
            </section>

            {/* Affiliates */}
            <section aria-labelledby="fashion-affiliate-heading">
              <div className="mb-3 flex items-center justify-between">
                <h2
                  id="fashion-affiliate-heading"
                  className="text-sm font-medium text-neutral-300"
                >
                  {t('affiliate_summary')}
                </h2>
                <Link
                  href={`/${locale}/dashboard/cinema/fashion/affiliate`}
                  className="text-xs text-violet-400 hover:text-violet-300"
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
                          <ShoppingBag className="h-3 w-3 text-neutral-500" aria-hidden="true" />
                        </div>
                        <div>
                          <p className="text-xs font-medium text-neutral-300">{affiliate.name}</p>
                          <p className="text-xs text-neutral-600">{affiliate.category}</p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold text-emerald-400">
                        {affiliate.rate}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </section>
          </div>
        </div>

        {/* Generation info */}
        <div className="mt-8 flex items-center justify-between rounded-xl border border-neutral-800 bg-neutral-950 px-6 py-4">
          <div>
            <p className="text-xs font-medium text-neutral-400">{t('generation_cost')}</p>
            <p className="text-xs text-neutral-600">~$3.10 USD {t('generation_time')}: {t('generation_minutes', { min: 8, max: 15 })}</p>
          </div>
          <p className="text-xs text-neutral-600">{t('quality_minimum')}</p>
        </div>
      </div>
    </div>
  )
}
