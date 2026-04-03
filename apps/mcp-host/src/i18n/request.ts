import { getRequestConfig } from 'next-intl/server';
import { routing } from '../routing.js';

export default getRequestConfig(async ({ requestLocale }) => {
  const locale = (await requestLocale) ?? routing.defaultLocale;
  const messages = (await import(`../../../packages/localization/src/messages/${locale}.json`)).default;
  return { locale, messages };
});
