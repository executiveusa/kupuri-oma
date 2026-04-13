import { redirect } from 'next/navigation'

interface AnimePageProps {
  params: Promise<{ locale: string }>
}

export default async function AnimePage({ params }: AnimePageProps) {
  const { locale } = await params
  redirect(`/${locale}/dashboard/cinema/coming-soon?niche=anime`)
}
