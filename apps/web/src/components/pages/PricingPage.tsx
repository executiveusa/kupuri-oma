'use client'

import { useTranslations } from 'next-intl'
import { Check, X, ArrowRight, LockKeyhole } from 'lucide-react'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface PricingPageProps {
  locale: string
}

type Currency = 'MXN' | 'USD'

const PLANS = [
  {
    key: 'free',
    priceMXN: 0,
    priceUSD: 0,
    included: ['community', 'remix3', 'preview5', 'freeTemplates'],
    highlighted: false,
  },
  {
    key: 'pro',
    priceMXN: 249,
    priceUSD: 14,
    included: [
      'community',
      'remix20',
      'preview50',
      'freeTemplates',
      'premiumTemplates',
      'bilingual',
      'basic3d',
    ],
    highlighted: true,
  },
  {
    key: 'studio',
    priceMXN: 699,
    priceUSD: 39,
    included: [
      'community',
      'unlimitedRemix',
      'unlimitedPreview',
      'allTemplates',
      'premiumTemplates',
      'bilingual',
      'team5',
      'advanced3d',
      'analytics',
      'prioritySupport',
    ],
    highlighted: false,
  },
] as const

const FEATURE_KEYS = [
  'community',
  'remix3',
  'remix20',
  'unlimitedRemix',
  'preview5',
  'preview50',
  'unlimitedPreview',
  'freeTemplates',
  'allTemplates',
  'premiumTemplates',
  'bilingual',
  'team5',
  'basic3d',
  'advanced3d',
  'analytics',
  'prioritySupport',
] as const

export function PricingPage({ locale }: PricingPageProps) {
  const t = useTranslations('pricing')
  const [currency, setCurrency] = useState<Currency>('MXN')

  return (
    <div className="px-6 py-16">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          className="mb-12 text-center"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <h1 className="text-4xl font-bold tracking-tight text-neutral-100 md:text-5xl">
            {t('title')}
          </h1>
          <p className="mt-4 text-lg text-neutral-400">{t('subtitle')}</p>
          <div className="mx-auto mt-5 flex max-w-2xl items-start gap-3 rounded-lg border border-amber-800/50 bg-amber-950/20 px-4 py-3 text-left">
            <LockKeyhole className="mt-0.5 shrink-0 text-amber-400" size={16} aria-hidden="true" />
            <p className="text-sm text-amber-100">{t('private_preview')}</p>
          </div>

          {/* Currency toggle */}
          <div className="mt-6 inline-flex items-center rounded-lg border border-neutral-700 p-1">
            {(['MXN', 'USD'] as Currency[]).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCurrency(c)}
                className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors duration-150 ${
                  currency === c
                    ? 'bg-neutral-700 text-neutral-100'
                    : 'text-neutral-500 hover:text-neutral-300'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Plans */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.key}
              className={`relative overflow-hidden rounded-xl border p-7 ${
                plan.highlighted
                  ? 'border-violet-700/60 bg-violet-950/20'
                  : 'border-neutral-800 bg-neutral-900'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              {plan.highlighted && (
                <div className="absolute right-4 top-4">
                  <span className="inline-flex items-center rounded-md border border-violet-700/60 bg-violet-900 px-2 py-0.5 text-xs font-medium text-violet-300">
                    {t('most_popular')}
                  </span>
                </div>
              )}

              <p className="text-lg font-semibold text-neutral-100">
                {t(`tiers.${plan.key}.name`)}
              </p>
              <p className="mt-1 text-sm text-neutral-500">{t(`tiers.${plan.key}.description`)}</p>

              <div className="my-6">
                {plan.priceMXN === 0 ? (
                  <p className="text-4xl font-bold text-neutral-100">Gratis</p>
                ) : currency === 'MXN' ? (
                  <p className="text-4xl font-bold text-neutral-100">
                    ${plan.priceMXN.toLocaleString('es-MX')}
                    <span className="ml-1 text-base font-normal text-neutral-500">MXN/mes</span>
                  </p>
                ) : (
                  <p className="text-4xl font-bold text-neutral-100">
                    ${plan.priceUSD}
                    <span className="ml-1 text-base font-normal text-neutral-500">USD/mes</span>
                  </p>
                )}
              </div>

              <ul className="mb-8 space-y-2.5" role="list">
                {FEATURE_KEYS.map((feature) => {
                  const included = (plan.included as readonly string[]).includes(feature)
                  return (
                    <li key={feature} className="flex items-center gap-2.5 text-sm">
                      {included ? (
                        <Check size={14} className="shrink-0 text-violet-400" aria-hidden="true" />
                      ) : (
                        <X size={14} className="shrink-0 text-neutral-700" aria-hidden="true" />
                      )}
                      <span className={included ? 'text-neutral-300' : 'text-neutral-600'}>
                        {t(`features.${feature}`)}
                      </span>
                    </li>
                  )
                })}
              </ul>

              <button
                type="button"
                disabled
                aria-describedby={`preview-note-${plan.key}`}
                className="inline-flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-lg border border-neutral-700 px-4 py-2.5 text-sm font-medium text-neutral-500"
              >
                {t('cta_preview')}
                <ArrowRight size={14} aria-hidden="true" />
              </button>
              <span id={`preview-note-${plan.key}`} className="sr-only">
                {t('private_preview')}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Enterprise */}
        <motion.div
          className="mt-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-900 px-6 py-5 sm:flex-row"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.35 }}
        >
          <div>
            <p className="font-semibold text-neutral-100">{t('tiers.enterprise.name')}</p>
            <p className="text-sm text-neutral-500">{t('tiers.enterprise.description')}</p>
          </div>
          <button
            type="button"
            disabled
            className="inline-flex shrink-0 cursor-not-allowed items-center gap-1.5 rounded-lg border border-neutral-700 px-4 py-2 text-sm text-neutral-500"
          >
            {t('cta_enterprise')} <ArrowRight size={14} aria-hidden="true" />
          </button>
        </motion.div>
      </div>
    </div>
  )
}
