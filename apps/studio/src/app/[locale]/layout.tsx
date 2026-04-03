import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { Plus_Jakarta_Sans } from 'next/font/google'
import { LOCALES } from '@kupuri/localization'
import '@/styles/globals.css'

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Kupuri Studio — Builder',
    template: '%s | Kupuri Studio',
  },
  description: 'Build cinematic websites and design systems — for LATAM creators.',
  robots: { index: false, follow: false }, // studio is private
}

export function generateStaticParams() {
  return LOCALES.map((locale) => ({ locale }))
}

interface RootLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export default async function RootLayout({ children, params }: RootLayoutProps) {
  const { locale } = await params

  if (!LOCALES.includes(locale as typeof LOCALES[number])) {
    notFound()
  }

  const messages = await getMessages()

  return (
    <html lang={locale} className={`${plusJakartaSans.variable} dark`}>
      <body className="bg-neutral-950 text-neutral-100 antialiased">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
