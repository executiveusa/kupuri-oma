'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface CtaSectionProps {
  locale: string
}

export function CtaSection({ locale }: CtaSectionProps) {
  const t = useTranslations('cta')
  const tHero = useTranslations('hero')
  const localePath = (path: string) => `/${locale}${path}`

  return (
    <section className="border-t border-neutral-800 px-6 py-24">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          {/* Gold accent line */}
          <div
            className="mx-auto mb-8 h-px w-16"
            style={{ background: 'oklch(68% 0.18 80 / 0.5)' }}
            aria-hidden="true"
          />

          <h2 className="text-balance text-3xl font-bold tracking-tight text-neutral-100 md:text-4xl">
            {t('headline')}{' '}
            <span className="text-neutral-400">{t('headline_accent')}</span>
          </h2>

          <p className="mx-auto mt-5 max-w-lg text-base text-neutral-500">
            {t('body')}
          </p>

          <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Link
              href={localePath('/register')}
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-violet-600 px-6 text-base font-medium text-white transition-colors duration-150 hover:bg-violet-500 active:scale-95"
            >
              {tHero('cta_primary')}
              <ArrowRight size={16} aria-hidden="true" />
            </Link>
            <Link
              href={localePath('/community')}
              className="inline-flex h-11 items-center rounded-lg border border-neutral-700 px-6 text-base text-neutral-400 transition-colors duration-150 hover:border-neutral-600 hover:text-neutral-200 active:scale-95"
            >
              {tHero('cta_secondary')}
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
