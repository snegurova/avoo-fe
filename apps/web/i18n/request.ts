import { getRequestConfig } from 'next-intl/server';

import { DEFAULT_LOCALE, Locale, MESSAGES, SUPPORTED_LOCALES } from '@avoo/intl';

import { routing } from './routing';

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !SUPPORTED_LOCALES.includes(locale as Locale)) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: MESSAGES[locale as Locale] ?? MESSAGES[DEFAULT_LOCALE],
    timeZone: 'Europe/Warsaw',
  };
});
