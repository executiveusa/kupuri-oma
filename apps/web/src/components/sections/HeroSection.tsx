'use client'

import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { ArrowRight, Sparkles, ChevronDown } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { VoiceOrb } from '@/components/ui/VoiceOrb'

interface HeroSectionProps {
  locale: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const EASE_OUT_EXPO = [0.16, 1, 0.3, 1] as const
const EASE_STANDARD = [0.4, 0, 0.2, 1] as const

// ─── Word-reveal headline ─────────────────────────────────────────────────────

function WordRevealHeadline({ text }: { text: string }) {
  const words = text.split(' ').filter(Boolean)

  return (
    <span aria-label={text}>
      {words.map((word, i) => (
        <motion.span
          key={`${word}-${i}`}
          className="inline-block"
          initial={{ opacity: 0, y: '0.45em', filter: 'blur(3px)' }}
          animate={{ opacity: 1, y: '0em', filter: 'blur(0px)' }}
          transition={{ duration: 0.55, delay: 0.12 + i * 0.055, ease: EASE_OUT_EXPO }}
          aria-hidden="true"
        >
          {word}
          {i < words.length - 1 ? '\u00a0' : ''}
        </motion.span>
      ))}
    </span>
  )
}

// ─── Or divider ───────────────────────────────────────────────────────────────

function OrDivider({ label }: { label: string }) {
  return (
    <div className="my-7 flex items-center gap-4">
      <div className="h-px flex-1 bg-neutral-800" />
      <span className="text-xs font-medium text-neutral-600">{label}</span>
      <div className="h-px flex-1 bg-neutral-800" />
    </div>
  )
}

// ─── HeroSection ─────────────────────────────────────────────────────────────

export function HeroSection({ locale }: HeroSectionProps) {
  const t = useTranslations('hero')
  const sectionRef = useRef<HTMLElement>(null)
  const localePath = (path: string) => `/${locale}${path}`

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end start'],
  })

  const visualY = useTransform(scrollYProgress, [0, 1], ['0%', '-10%'])

  return (
    <section
      ref={sectionRef}
      className="relative isolate min-h-[100svh] overflow-hidden px-6 pb-20 pt-32"
    >
      {/* ── Ambient background ──────────────────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div
          className="absolute inset-0"
          style={{
            background:
              'radial-gradient(ellipse 85% 55% at 50% -5%, oklch(40% 0.15 290 / 0.2), transparent 68%)',
          }}
        />
        <motion.div
          className="absolute left-1/2 top-0 h-[520px] w-[720px] -translate-x-1/2"
          style={{
            background:
              'radial-gradient(ellipse 55% 40% at 50% 16%, oklch(42% 0.2 290 / 0.13), transparent)',
          }}
          animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.05, 1] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
        />
        {/* Gold accent — voice interface warmth */}
        <motion.div
          className="absolute bottom-0 right-0 h-[300px] w-[300px] translate-x-1/3 translate-y-1/3"
          style={{
            background: 'radial-gradient(circle, oklch(68% 0.18 80 / 0.18), transparent 70%)',
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      <div className="mx-auto max-w-3xl text-center">
        {/* ── Badge / eyebrow ───────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.88 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, ease: [0.34, 1.4, 0.64, 1] }}
        >
          <span className="inline-flex items-center gap-1.5 rounded-md border border-violet-700/50 bg-violet-950/50 px-3 py-1 text-xs font-medium tracking-wide text-violet-300">
            <Sparkles size={11} aria-hidden="true" />
            {t('badge')}
          </span>
        </motion.div>

        {/* ── Headline ─────────────────────────────────────────────────── */}
        <h1 className="mt-6 text-balance text-5xl font-bold leading-[1.08] tracking-tight text-neutral-50 md:text-6xl lg:text-7xl">
          <WordRevealHeadline text={t('headline')} />
        </h1>

        {/* ── Subheadline ───────────────────────────────────────────────── */}
        <motion.p
          className="mx-auto mt-5 max-w-xl text-pretty text-base leading-relaxed text-neutral-400 md:text-lg"
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5, ease: EASE_STANDARD }}
        >
          {t('subheadline')}
        </motion.p>

        {/* ── Voice Orb — PRIMARY CTA ───────────────────────────────────── */}
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.55, delay: 0.68, ease: [0.34, 1.4, 0.64, 1] }}
        >
          <VoiceOrb
            locale={locale}
            idleLabel={t('voice_prompt')}
            listeningLabel={t('voice_listening')}
            processingLabel={t('voice_processing')}
          />
        </motion.div>

        {/* ── Or divider ────────────────────────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.9 }}
        >
          <OrDivider label={t('voice_or')} />
        </motion.div>

        {/* ── Secondary CTAs ────────────────────────────────────────────── */}
        <motion.div
          className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 1.0, ease: EASE_STANDARD }}
        >
          <Link
            href={localePath('/register')}
            className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-violet-600 px-6 text-sm font-semibold text-white shadow-lg shadow-violet-950/40 transition-all duration-150 hover:bg-violet-500 active:scale-[0.97] sm:w-auto"
          >
            {t('cta_primary')}
            <ArrowRight size={15} aria-hidden="true" />
          </Link>
          <Link
            href={localePath('/community')}
            className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-neutral-700 px-6 text-sm text-neutral-300 transition-all duration-150 hover:border-neutral-600 hover:bg-neutral-800/60 hover:text-neutral-100 active:scale-[0.97] sm:w-auto"
          >
            {t('cta_secondary')}
          </Link>
        </motion.div>

        {/* ── Social proof ──────────────────────────────────────────────── */}
        <motion.p
          className="mt-6 text-xs text-neutral-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.2 }}
        >
          {t('social_proof', { count: '12k' })}
        </motion.p>
      </div>

      {/* ── Hero visual — parallax on scroll ─────────────────────────── */}
      <motion.div
        className="mx-auto mt-16 max-w-5xl"
        style={{ y: visualY }}
        initial={{ opacity: 0, y: 36 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 0.5, ease: EASE_STANDARD }}
      >
        <HeroVisual />
      </motion.div>

      {/* ── Mobile scroll indicator ───────────────────────────────────── */}
      <motion.div
        className="pointer-events-none absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center md:hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 1.6 }}
        aria-hidden="true"
      >
        <motion.div
          animate={{ y: [0, 5, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut', repeatDelay: 0.3 }}
        >
          <ChevronDown size={18} className="text-neutral-600" />
        </motion.div>
      </motion.div>
    </section>
  )
}

// ─── Hero Visual ─────────────────────────────────────────────────────────────

const CARD_REMIXES = [247, 518, 93] as const

function HeroVisual() {
  const cards = [
    { title: 'Fintech LATAM', vibe: 'Bold & Confiable', status: 'premium', color: 'violet' },
    { title: 'Studio Creativo', vibe: 'Cinematográfico', status: 'featured', color: 'gold' },
    { title: 'E-commerce MX', vibe: 'Limpio & Moderno', status: 'free', color: 'neutral' },
  ]

  return (
    <div className="relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-900/60 p-5 md:p-6">
      {/* Top bar — terminal-style context */}
      <div className="mb-5 flex items-center gap-2 border-b border-neutral-800 pb-4">
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
          <span className="h-2.5 w-2.5 rounded-full bg-neutral-700" />
        </div>
        <span className="ml-2 font-mono text-xs text-neutral-600">kupuri-oma / comunidad</span>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {cards.map((card, i) => (
          <motion.div
            key={card.title}
            className="group relative overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950 p-4 transition-colors duration-150 hover:border-neutral-700 md:p-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.55 + i * 0.1, ease: EASE_OUT_EXPO }}
          >
            {/* Thumbnail */}
            <div
              className="mb-4 h-24 overflow-hidden rounded-lg md:h-28"
              style={{
                background:
                  card.color === 'violet'
                    ? 'linear-gradient(135deg, oklch(22% 0.12 290) 0%, oklch(14% 0.05 290) 100%)'
                    : card.color === 'gold'
                      ? 'linear-gradient(135deg, oklch(22% 0.1 80) 0%, oklch(14% 0.04 80) 100%)'
                      : 'linear-gradient(135deg, oklch(18% 0.03 270) 0%, oklch(12% 0.01 270) 100%)',
              }}
              aria-hidden="true"
            >
              {/* Subtle UI skeleton hint */}
              <div className="m-3 h-2 w-3/5 rounded-sm bg-white/5" />
              <div className="mx-3 mt-2 h-2 w-2/5 rounded-sm bg-white/[0.03]" />
              <div
                className="m-3 mt-4 h-8 rounded-md"
                style={{ background: 'oklch(100% 0 0 / 0.04)' }}
              />
            </div>
            <p className="text-sm font-semibold text-neutral-200">{card.title}</p>
            <p className="mt-1 text-xs text-neutral-500">{card.vibe}</p>
            <div className="mt-3 flex items-center justify-between">
              <span
                className={`inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium ${
                  card.status === 'premium'
                    ? 'border-yellow-800/40 bg-yellow-950/60 text-yellow-400'
                    : card.status === 'featured'
                      ? 'border-violet-800/40 bg-violet-950 text-violet-300'
                      : 'border-neutral-700 bg-neutral-800 text-neutral-400'
                }`}
              >
                {card.status === 'premium' ? 'Premium' : card.status === 'featured' ? 'Destacado' : 'Gratis'}
              </span>
              <span className="font-mono text-xs text-neutral-700">
                {CARD_REMIXES[i]} remixes
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
