import { redirect } from 'next/navigation'
import { DEFAULT_LOCALE } from '@kupuri/localization'

// Root redirects to default locale
export default function RootPage() {
  redirect(`/${DEFAULT_LOCALE}`)
}
