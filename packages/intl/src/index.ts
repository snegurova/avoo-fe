import en from './locales/en.json';
import pl from './locales/pl.json';
import uk from './locales/uk.json';

export const SUPPORTED_LOCALES = ['pl', 'en', 'uk'] as const;
export type Locale = (typeof SUPPORTED_LOCALES)[number];
export const Locales = {
  PL: 'pl',
  EN: 'en',
  UK: 'uk',
} as const satisfies Record<string, Locale>;

export const DEFAULT_LOCALE: Locale = 'pl';

export const MESSAGES: Record<Locale, Record<string, string>> = {
  en,
  pl,
  uk,
};
