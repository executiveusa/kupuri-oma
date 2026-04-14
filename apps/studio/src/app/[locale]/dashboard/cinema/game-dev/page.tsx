import { redirect } from 'next/navigation'

interface GameDevPageProps {
  params: Promise<{ locale: string }>
}

export default async function GameDevPage({ params }: GameDevPageProps) {
  const { locale } = await params
  redirect(`/${locale}/dashboard/cinema/coming-soon?niche=game-dev`)
}
