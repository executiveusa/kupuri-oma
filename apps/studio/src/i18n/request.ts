import { getRequestConfig } from 'next-intl/server'
import { LOCALES, DEFAULT_LOCALE } from '@kupuri/localization'

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale

  if (!locale || !LOCALES.includes(locale as typeof LOCALES[number])) {
    locale = DEFAULT_LOCALE
  }

  return {
    locale,
    messages: (await import(`@kupuri/localization/messages/${locale}`)).default
  }
})
