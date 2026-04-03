'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Eye, EyeOff } from 'lucide-react'

interface RegisterFormProps {
  locale: string
}

export function RegisterForm({ locale }: RegisterFormProps) {
  const t = useTranslations('auth')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const localePath = (path: string) => `/${locale}${path}`

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    // TODO: wire next-auth register flow
    await new Promise((r) => setTimeout(r, 800))
    setLoading(false)
  }

  return (
    <div className="w-full max-w-sm">
      <div className="mb-8 text-center">
        <Link href={localePath('/')} className="inline-block mb-6">
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600">
            <span className="text-sm font-bold text-white">K</span>
          </div>
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-100">{t('register_title')}</h1>
        <p className="mt-2 text-sm text-neutral-500">{t('register_subtitle')}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-neutral-300">
            {t('name_label')}
          </label>
          <input
            id="name"
            type="text"
            name="name"
            autoComplete="name"
            required
            placeholder={t('name_placeholder')}
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 transition-colors focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-neutral-300">
            {t('email_label')}
          </label>
          <input
            id="email"
            type="email"
            name="email"
            autoComplete="email"
            required
            placeholder={t('email_placeholder')}
            className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2.5 text-sm text-neutral-100 placeholder-neutral-600 transition-colors focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600"
          />
        </div>

        <div>
          <label htmlFor="password" className="mb-1.5 block text-sm font-medium text-neutral-300">
            {t('password_label')}
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPw ? 'text' : 'password'}
              name="password"
              autoComplete="new-password"
              required
              minLength={8}
              placeholder={t('password_placeholder')}
              className="w-full rounded-md border border-neutral-700 bg-neutral-900 px-3 py-2.5 pr-10 text-sm text-neutral-100 placeholder-neutral-600 transition-colors focus:border-violet-600 focus:outline-none focus:ring-1 focus:ring-violet-600"
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 transition-colors hover:text-neutral-300"
              aria-label={showPw ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-violet-600 py-2.5 text-sm font-medium text-white transition-colors duration-150 hover:bg-violet-500 disabled:opacity-50"
        >
          {loading ? 'Creando cuenta…' : t('register_button')}
        </button>
      </form>

      <p className="mt-4 text-center text-xs text-neutral-600">
        {t('terms_agreement', {
          terms: '',
          privacy: '',
        })}
        <Link href={localePath('/terms')} className="text-neutral-500 hover:text-neutral-300">
          {t('terms')}
        </Link>{' '}
        y{' '}
        <Link href={localePath('/privacy')} className="text-neutral-500 hover:text-neutral-300">
          {t('privacy')}
        </Link>
        .
      </p>

      <p className="mt-4 text-center text-sm text-neutral-500">
        {t('have_account')}
        <Link
          href={localePath('/login')}
          className="text-violet-400 transition-colors hover:text-violet-300"
        >
          {t('login_link')}
        </Link>
      </p>
    </div>
  )
}
