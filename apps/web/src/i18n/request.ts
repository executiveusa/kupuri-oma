import { getRequestConfig } from 'next-intl/server'
import { DEFAULT_LOCALE, LOCALES } from '@kupuri/localization'
import type { Locale } from '@kupuri/localization'
import enMessages from '../../../../packages/localization/src/messages/en.json'
import esMXMessages from '../../../../packages/localization/src/messages/es-MX.json'

const messageMap: Record<string, Record<string, unknown>> = {
  en: enMessages,
  'es-MX': esMXMessages,
}

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  // Validate locale — fallback to es-MX
  if (!locale || !LOCALES.includes(locale as Locale)) {
    locale = DEFAULT_LOCALE
  }

  return {
    locale,
    messages: (messageMap[locale] ?? messageMap[DEFAULT_LOCALE]) as any,
  }
})

