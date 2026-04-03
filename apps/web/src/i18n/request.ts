import { getRequestConfig } from 'next-intl/server'
import { DEFAULT_LOCALE, LOCALES } from '@kupuri/localization'
import type { Locale } from '@kupuri/localization'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  // Validate locale — fallback to es-MX
  if (!locale || !LOCALES.includes(locale as Locale)) {
    locale = DEFAULT_LOCALE
  }

  const messages = await import(`@kupuri/localization/messages/${locale}`).catch(
    () => import('@kupuri/localization/messages/es-MX'),
  )

  return {
    locale,
    messages: messages.default,
  }
})
