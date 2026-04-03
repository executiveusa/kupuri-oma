'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'

interface CommunitySectionProps {
  locale: string
}

// Seed projects — will be replaced by live DB data
const SEED_PROJECTS = [
  { id: '1', title: 'Banca Digital Moderna', vibe: 'Fintech · Confiable', remixes: 312, premium: false, gradient: 'linear-gradient(135deg, oklch(20% 0.1 240) 0%, oklch(13% 0.05 240) 100%)', creator: 'Santiago R.', initials: 'SR' },
  { id: '2', title: 'Portafolio Arquitectura', vibe: 'Editorial · Minimalista', remixes: 198, premium: true, gradient: 'linear-gradient(135deg, oklch(16% 0.015 0) 0%, oklch(10% 0.01 0) 100%)', creator: 'Valentina M.', initials: 'VM' },
  { id: '3', title: 'App Salud CDMX', vibe: 'Claro · Amigable', remixes: 87, premium: false, gradient: 'linear-gradient(135deg, oklch(18% 0.1 150) 0%, oklch(12% 0.04 150) 100%)', creator: 'Camilo P.', initials: 'CP' },
  { id: '4', title: 'Newsletter Inversiones', vibe: 'Smart · Directo', remixes: 441, premium: true, gradient: 'linear-gradient(135deg, oklch(22% 0.1 80) 0%, oklch(14% 0.04 80) 100%)', creator: 'Isabela F.', initials: 'IF' },
  { id: '5', title: 'Estudio Fotografía', vibe: 'Cinematográfico · Oscuro', remixes: 256, premium: false, gradient: 'linear-gradient(135deg, oklch(14% 0.03 290) 0%, oklch(9% 0.01 290) 100%)', creator: 'Diego A.', initials: 'DA' },
  { id: '6', title: 'Restaurante Contemporáneo', vibe: 'Cálido · Premium', remixes: 129, premium: true, gradient: 'linear-gradient(135deg, oklch(20% 0.12 30) 0%, oklch(13% 0.05 30) 100%)', creator: 'Lucía T.', initials: 'LT' },
]

export function CommunitySection({ locale }: CommunitySectionProps) {
  const t = useTranslations('community')
  const tCta = useTranslations('cta')
  const localePath = (path: string) => `/${locale}${path}`

  return (
    <section className="border-t border-neutral-800 bg-neutral-900/30 px-6 py-24">
      <div className="mx-auto max-w-6xl">
        {/* Header */}
        <motion.div
          className="mb-12 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-100 md:text-4xl">
              {t('title')}
            </h2>
            <p className="mt-2 text-base text-neutral-400">{t('subtitle')}</p>
          </div>
          <Link
            href={localePath('/community')}
            className="inline-flex shrink-0 items-center gap-1.5 text-sm text-violet-400 transition-colors hover:text-violet-300"
          >
            {tCta('see_all_community')} <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </motion.div>

        {/* Project grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {SEED_PROJECTS.map((project, i) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.05 }}
            >
              <Link
                href={localePath(`/community/${project.id}`)}
                className="group block overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 transition-colors duration-150 hover:border-neutral-700"
              >
                {/* Thumbnail */}
                <div
                  className="relative h-40 overflow-hidden"
                  style={{ background: project.gradient }}
                  aria-hidden="true"
                >
                  {/* UI skeleton hints */}
                  <div className="m-4 h-2 w-2/5 rounded-sm bg-white/[0.06]" />
                  <div className="mx-4 mt-2 h-2 w-1/3 rounded-sm bg-white/[0.04]" />
                  <div className="m-4 mt-4 h-10 rounded-lg bg-white/[0.04]" />
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-neutral-100">
                        {project.title}
                      </p>
                      <p className="mt-0.5 text-xs text-neutral-500">{project.vibe}</p>
                    </div>
                    {project.premium && (
                      <span className="inline-flex shrink-0 items-center rounded-md border border-yellow-800/40 bg-yellow-950/60 px-1.5 py-0.5 text-xs font-medium text-yellow-400">
                        {t('premium_label')}
                      </span>
                    )}
                  </div>
                  {/* Creator attribution */}
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-neutral-800 text-[9px] font-semibold text-neutral-400">
                        {project.initials}
                      </span>
                      <span className="text-xs text-neutral-600">{project.creator}</span>
                    </div>
                    <p className="text-xs text-neutral-700">
                      {t('remix_count', { count: project.remixes })}
                    </p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
