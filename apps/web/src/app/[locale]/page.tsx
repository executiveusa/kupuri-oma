import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { HeroSection } from '@/components/sections/HeroSection'
import { FeaturesSection } from '@/components/sections/FeaturesSection'
import { CommunitySection } from '@/components/sections/CommunitySection'
import { PricingTeaser } from '@/components/sections/PricingTeaser'
import { CtaSection } from '@/components/sections/CtaSection'

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'hero' })

  return {
    title: t('headline'),
    description: t('subheadline'),
  }
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  return (
    <div className="min-h-screen bg-ambient">
      <Navbar locale={locale} />
      <main>
        <HeroSection locale={locale} />
        <FeaturesSection locale={locale} />
        <CommunitySection locale={locale} />
        <PricingTeaser locale={locale} />
        <CtaSection locale={locale} />
      </main>
      <Footer locale={locale} />
    </div>
  )
}
