import { redirect } from 'next/navigation'

interface EducationPageProps {
  params: Promise<{ locale: string }>
}

export default async function EducationPage({ params }: EducationPageProps) {
  const { locale } = await params
  redirect(`/${locale}/dashboard/cinema/coming-soon?niche=education`)
}
