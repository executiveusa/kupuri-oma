'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { useTranslations } from 'next-intl'
import {
  Lock,
  ArrowLeft,
  GraduationCap,
  Swords,
  Gamepad2,
  CheckCircle2,
  Loader2,
} from 'lucide-react'
import { Button } from '@kupuri/design-system'

// ── Niche config ────────────────────────────────────────────────────────────

type SupportedNiche = 'education' | 'anime' | 'game-dev'

interface NicheConfig {
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: 'true' }>
  accentColor: string
  borderColor: string
  iconBg: string
  translationKey: 'education' | 'anime' | 'game_dev'
  features: string[]
}

const NICHE_CONFIGS: Record<SupportedNiche, NicheConfig> = {
  education: {
    icon: GraduationCap,
    accentColor: 'text-blue-400',
    borderColor: 'border-blue-800/30',
    iconBg: 'bg-blue-900/30 text-blue-400',
    translationKey: 'education',
    features: [
      'Generación automática de cursos desde tu código o contenido',
      'Explicaciones en video (español, inglés, hindi)',
      'Módulos de aprendizaje interactivos',
      'Integración con Udemy, Skillshare y Teachable',
      'Certificados y seguimiento de progreso',
    ],
  },
  anime: {
    icon: Swords,
    accentColor: 'text-pink-400',
    borderColor: 'border-pink-800/30',
    iconBg: 'bg-pink-900/30 text-pink-400',
    translationKey: 'anime',
    features: [
      'Animación de personajes con consistencia visual garantizada',
      'Visualización de historias y arcos narrativos',
      'Presets estéticos exclusivos para anime y manga',
      'Galería de la comunidad para compartir creaciones',
      'Integración con Patreon y Gumroad',
    ],
  },
  'game-dev': {
    icon: Gamepad2,
    accentColor: 'text-orange-400',
    borderColor: 'border-orange-800/30',
    iconBg: 'bg-orange-900/30 text-orange-400',
    translationKey: 'game_dev',
    features: [
      'Trailers cinematográficos para tu juego',
      'Showcase de assets 3D con animación',
      'Demos de personajes para portfolios',
      'Integración con Unity Asset Store y Unreal Engine',
      'Generación de thumbnails y material de marketing',
    ],
  },
}

function getNicheFromParam(param: string | null): SupportedNiche {
  if (param === 'education' || param === 'anime' || param === 'game-dev') {
    return param
  }
  return 'education'
}

// ── Waitlist form ────────────────────────────────────────────────────────────

interface WaitlistFormProps {
  niche: SupportedNiche
}

function WaitlistForm({ niche }: WaitlistFormProps) {
  const t = useTranslations('cinema.coming_soon')
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!email.trim() || !email.includes('@')) {
      setError('Ingresa un correo válido.')
      return
    }
    setError(null)

    startTransition(async () => {
      try {
        const res = await fetch('/api/cinema/waitlist', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), niche }),
        })

        if (!res.ok) throw new Error('request_failed')
        setSubmitted(true)
      } catch {
        setError('No se pudo registrar. Intenta de nuevo.')
      }
    })
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-emerald-800/30 bg-emerald-950/20 px-6 py-8 text-center">
        <CheckCircle2 className="h-8 w-8 text-emerald-400" aria-hidden="true" />
        <p className="text-sm font-medium text-emerald-300">{t('waitlist_success')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3" noValidate>
      <label htmlFor="waitlist-email" className="text-xs font-medium text-neutral-400">
        {t('waitlist_label')}
      </label>
      <div className="flex gap-2">
        <input
          id="waitlist-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t('waitlist_placeholder')}
          className="h-9 flex-1 rounded-lg border border-neutral-700 bg-neutral-900 px-3 text-sm text-neutral-100 placeholder:text-neutral-600 focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
          autoComplete="email"
          aria-describedby={error ? 'waitlist-error' : undefined}
          disabled={isPending}
        />
        <Button type="submit" size="md" loading={isPending} disabled={isPending}>
          {t('waitlist_cta')}
        </Button>
      </div>
      {error && (
        <p id="waitlist-error" className="text-xs text-red-400" role="alert">
          {error}
        </p>
      )}
      <p className="text-xs text-neutral-600">{t('invite_only_description')}</p>
    </form>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function ComingSoonPage() {
  const params = useParams<{ locale: string }>()
  const searchParams = useSearchParams()
  const t = useTranslations('cinema')
  const tNiche = useTranslations('cinema.coming_soon')

  const locale = params.locale
  const nicheParam = searchParams.get('niche')
  const niche = getNicheFromParam(nicheParam)
  const config = NICHE_CONFIGS[niche]
  const Icon = config.icon

  const nicheName = t(`niches.${config.translationKey}.name` as Parameters<typeof t>[0])
  const nicheDetail = t(
    `niches.${config.translationKey}.coming_soon_detail` as Parameters<typeof t>[0],
  )

  return (
    <div className="flex flex-col overflow-auto">
      {/* Top bar */}
      <header className="flex h-14 items-center gap-4 border-b border-neutral-800 px-6">
        <Link
          href={`/${locale}/dashboard/cinema`}
          className="flex items-center gap-1.5 text-xs text-neutral-500 transition-colors hover:text-neutral-300"
          aria-label={tNiche('back_to_studio')}
        >
          <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
          {tNiche('back_to_studio')}
        </Link>
      </header>

      {/* Main */}
      <div className="flex-1 overflow-auto">
        <div className="mx-auto max-w-lg px-6 py-16">
          {/* Icon + badges */}
          <div className="flex flex-col items-center gap-6 text-center">
            <div
              className={`flex h-16 w-16 items-center justify-center rounded-2xl ${config.iconBg}`}
              aria-hidden="true"
            >
              <Icon className="h-8 w-8" aria-hidden="true" />
            </div>

            {/* Invite-only badge */}
            <div className="flex items-center gap-2">
              <span
                className={`inline-flex items-center gap-1.5 rounded-full border ${config.borderColor} px-3 py-1 text-xs font-semibold ${config.accentColor}`}
              >
                <Lock className="h-3 w-3" aria-hidden="true" />
                {t('invite_only_badge')}
              </span>
            </div>

            {/* Heading */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-neutral-50">
                {nicheName}
              </h1>
              <p className="mt-1 text-lg font-medium text-neutral-500">
                {tNiche('heading')}
              </p>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed text-neutral-400">{nicheDetail}</p>
          </div>

          {/* Features */}
          <div className="mt-10">
            <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-neutral-600">
              {tNiche('features_heading')}
            </h2>
            <ul className="flex flex-col gap-2.5" role="list">
              {config.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2.5">
                  <span
                    className={`mt-0.5 h-4 w-4 shrink-0 rounded-full border ${config.borderColor} flex items-center justify-center`}
                    aria-hidden="true"
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${config.accentColor.replace('text-', 'bg-')}`} />
                  </span>
                  <span className="text-sm text-neutral-400">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Waitlist form */}
          <div
            className={`mt-10 rounded-xl border ${config.borderColor} bg-neutral-950 p-6`}
          >
            <WaitlistForm niche={niche} />
          </div>
        </div>
      </div>
    </div>
  )
}
