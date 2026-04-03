import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { PricingPage } from '@/components/pages/PricingPage'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'pricing' })
  return {
    title: t('title'),
    description: t('subtitle'),
  }
}

export default async function Pricing({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <div className="min-h-screen bg-neutral-950">
      <Navbar locale={locale} />
      <main className="pt-20">
        <PricingPage locale={locale} />
      </main>
      <Footer locale={locale} />
    </div>
  )
}
