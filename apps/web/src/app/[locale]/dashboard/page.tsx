import type { Metadata } from 'next'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { DashboardHome } from '@/components/dashboard/DashboardHome'

export const metadata: Metadata = {
  title: 'Panel de control',
}

export default async function Dashboard({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  return (
    <DashboardLayout locale={locale}>
      <DashboardHome locale={locale} />
    </DashboardLayout>
  )
}
