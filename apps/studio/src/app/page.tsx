import { redirect } from 'next/navigation'
import { DEFAULT_LOCALE } from '@kupuri/localization'

export default function RootPage() {
  redirect(`/${DEFAULT_LOCALE}/dashboard`)
}
