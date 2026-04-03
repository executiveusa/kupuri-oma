'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Check, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface PricingTeaserProps {
  locale: string
}

// Pricing data — MXN primary
const PLANS = [
  { key: 'free',   priceMXN: 0,   priceUSD: 0,  featureCount: 4, cta: 'cta_free',   highlighted: false },
  { key: 'pro',    priceMXN: 299, priceUSD: 15, featureCount: 6, cta: 'cta_pro',    highlighted: true  },
  { key: 'studio', priceMXN: 799, priceUSD: 40, featureCount: 6, cta: 'cta_studio', highlighted: false },
] as const

export function PricingTeaser({ locale }: PricingTeaserProps) {
  const t = useTranslations('pricing')
  const localePath = (path: string) => `/${locale}${path}`

  return (
    <section className="border-t border-neutral-800 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          className="mb-16 text-center"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-neutral-100 md:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-3 text-base text-neutral-400">{t('subtitle')}</p>
        </motion.div>

        {/* Plans grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {PLANS.map((plan, i) => (
            <motion.div
              key={plan.key}
              className={`relative overflow-hidden rounded-xl border p-6 ${
                plan.highlighted
                  ? 'border-violet-700/60 bg-violet-950/20'
                  : 'border-neutral-800 bg-neutral-900'
              }`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              {/* Popular badge */}
              {plan.highlighted && (
                <div className="absolute right-4 top-4">
                  <span className="inline-flex items-center rounded-md border border-violet-700/60 bg-violet-900 px-2 py-0.5 text-xs font-medium text-violet-300">
                    {t('most_popular')}
                  </span>
                </div>
              )}

              {/* Plan name */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-neutral-100">
                  {t(`tiers.${plan.key}.name`)}
                </p>
                <p className="mt-1 text-xs text-neutral-500">
                  {t(`tiers.${plan.key}.description`)}
                </p>
              </div>

              {/* Price */}
              <div className="mb-8">
                {plan.priceMXN === 0 ? (
                  <p className="text-4xl font-bold text-neutral-100">{t('free_price')}</p>
                ) : (
                  <div>
                    <p className="text-4xl font-bold text-neutral-100">
                      ${plan.priceMXN.toLocaleString('es-MX')}
                      <span className="ml-1 text-base font-normal text-neutral-500">MXN</span>
                    </p>
                    <p className="mt-1 text-xs text-neutral-600">
                      ~${plan.priceUSD} USD {t('per_month')}
                    </p>
                  </div>
                )}
              </div>

              {/* Features */}
              <ul className="mb-8 space-y-3" role="list">
                {Array.from({ length: plan.featureCount }, (_, fi) => (
                  <li key={fi} className="flex items-start gap-2.5 text-sm">
                    <Check
                      size={15}
                      className={`mt-0.5 shrink-0 ${plan.highlighted ? 'text-violet-400' : 'text-neutral-500'}`}
                      aria-hidden="true"
                    />
                    <span className="text-neutral-300">{t(`tiers.${plan.key}.f${fi}`)}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <Link
                href={localePath(plan.priceMXN === 0 ? '/register' : '/register?plan=' + plan.key)}
                className={`inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors duration-150 ${
                  plan.highlighted
                    ? 'bg-violet-600 text-white hover:bg-violet-500'
                    : 'border border-neutral-700 text-neutral-300 hover:border-neutral-600 hover:bg-neutral-800 hover:text-neutral-100'
                }`}
              >
                {t(plan.cta)}
                <ArrowRight size={14} aria-hidden="true" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Enterprise row */}
        <motion.div
          className="mt-6 flex flex-col items-center justify-between gap-4 rounded-xl border border-neutral-800 bg-neutral-900 px-6 py-5 sm:flex-row"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: 0.3 }}
        >
          <div>
            <p className="text-sm font-semibold text-neutral-100">
              {t('tiers.enterprise.name')}
            </p>
            <p className="text-xs text-neutral-500">{t('tiers.enterprise.description')}</p>
          </div>
          <Link
            href={localePath('/contact')}
            className="inline-flex shrink-0 items-center gap-1.5 text-sm text-violet-400 transition-colors hover:text-violet-300"
          >
            {t('cta_enterprise')} <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </motion.div>

        {/* Full pricing link */}
        <p className="mt-8 text-center text-sm text-neutral-600">
          <Link
            href={localePath('/pricing')}
            className="text-neutral-400 underline-offset-4 transition-colors hover:text-neutral-200 hover:underline"
          >
            Ver comparación completa de planes →
          </Link>
        </p>
      </div>
    </section>
  )
}
