import type { Metadata } from 'next'
import { getTranslations } from 'next-intl/server'
import { StudioLayout } from '@/components/layout/StudioLayout'

interface DashboardLayoutProps {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export async function generateMetadata({ params }: DashboardLayoutProps): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'dashboard' })
  return { title: t('title') }
}

export default async function DashboardLayout({ children, params }: DashboardLayoutProps) {
  const { locale } = await params
  return <StudioLayout locale={locale}>{children}</StudioLayout>
}
