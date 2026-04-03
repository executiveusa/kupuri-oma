import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { LOCALES } from '@kupuri/localization'
import type { Locale } from '@kupuri/localization'
import '@/styles/globals.css'

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

export const metadata: Metadata = {
  title: {
    template: '%s | Kupuri OMA',
    default: 'Kupuri OMA — Estudio de Diseño Digital LATAM',
  },
  description:
    'La plataforma de diseño digital más avanzada de América Latina. Crea sitios extraordinarios con IA, plantillas cinematográficas y comunidad creativa.',
  keywords: ['diseño web', 'IA', 'LATAM', 'México', 'plantillas', 'studio digital'],
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    alternateLocale: ['en_US'],
    siteName: 'Kupuri OMA',
  },
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!LOCALES.includes(locale as Locale)) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-neutral-950 text-neutral-100 antialiased">
        {/* Film grain atmospheric overlay — 2% opacity, pointer-events none */}
        <div className="grain" aria-hidden="true" />
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
