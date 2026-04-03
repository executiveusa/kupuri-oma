'use client'

import { useTranslations } from 'next-intl'
import { Wand2, Film, Shuffle, Box, Globe, Terminal } from 'lucide-react'
import { motion } from 'framer-motion'

interface FeaturesSectionProps {
  locale: string
}

const FEATURE_ICONS = {
  ai_generation: Wand2,
  cinematic: Film,
  remix: Shuffle,
  '3d': Box,
  bilingual: Globe,
  mcp_cli: Terminal,
} as const

export function FeaturesSection({ locale: _locale }: FeaturesSectionProps) {
  const t = useTranslations('features')

  const features = Object.keys(FEATURE_ICONS) as Array<keyof typeof FEATURE_ICONS>

  return (
    <section className="border-t border-neutral-800 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Section header */}
        <motion.div
          className="mb-16 max-w-2xl"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
        >
          <h2 className="text-3xl font-bold tracking-tight text-neutral-100 md:text-4xl">
            {t('title')}
          </h2>
          <p className="mt-3 text-base text-neutral-400">{t('subtitle')}</p>
        </motion.div>

        {/* Feature grid — 3 col on desktop, staggered entry */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {features.map((key, i) => {
            const Icon = FEATURE_ICONS[key]
            return (
              <motion.div
                key={key}
                className="group rounded-xl border border-neutral-800 bg-neutral-900 p-6 transition-colors duration-150 hover:border-neutral-700 hover:bg-neutral-800/80"
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-violet-950 text-violet-400">
                  <Icon size={20} aria-hidden="true" />
                </div>
                <h3 className="text-base font-semibold text-neutral-100">
                  {t(`${key}.title`)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                  {t(`${key}.description`)}
                </p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// Prop used for SSR locale resolution — keep for page compat
FeaturesSection.displayName = 'FeaturesSection'

export { FeaturesSection as default }
