/**
 * Localization configuration for Kupuri OMA LATAM
 *
 * Primary: es-MX (Spanish Mexico)
 * Secondary: en (English)
 * Fallback chain: es-MX → es → en
 */

export const LOCALES = ['es-MX', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export const DEFAULT_LOCALE: Locale = 'es-MX'
export const FALLBACK_LOCALE: Locale = 'en'

/** Currency per locale */
export const LOCALE_CURRENCY: Record<Locale, string> = {
  'es-MX': 'MXN',
  en: 'USD',
}

/** Human-readable locale label */
export const LOCALE_LABELS: Record<Locale, string> = {
  'es-MX': 'Español (México)',
  en: 'English',
}

/** Date locale string for Intl APIs */
export const LOCALE_INTL: Record<Locale, string> = {
  'es-MX': 'es-MX',
  en: 'en-US',
}

/**
 * Format currency amount for a locale.
 * Default: MXN for es-MX
 */
export function formatCurrency(amount: number, locale: Locale = DEFAULT_LOCALE): string {
  const currency = LOCALE_CURRENCY[locale]
  return new Intl.NumberFormat(LOCALE_INTL[locale], {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format a date per locale norms.
 * Mexico uses dd/mm/yyyy by default.
 */
export function formatDate(
  date: Date,
  locale: Locale = DEFAULT_LOCALE,
  options: Intl.DateTimeFormatOptions = { dateStyle: 'medium' },
): string {
  return new Intl.DateTimeFormat(LOCALE_INTL[locale], options).format(date)
}

/**
 * Returns a locale-prefixed URL path.
 * e.g. localePath('/pricing', 'es-MX') => '/es-mx/pricing'
 */
export function localePath(path: string, locale: Locale = DEFAULT_LOCALE): string {
  const prefix = locale.toLowerCase()
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `/${prefix}${normalized}`
}
