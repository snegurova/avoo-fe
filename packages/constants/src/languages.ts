import type { MasterLanguages } from '@avoo/axios/types/apiTypes';

export const VALID_LANGUAGE_CODES = [
  'ar', 'bn', 'da', 'de', 'en', 'es', 'fi', 'fr', 'hr', 'hi', 'is', 'it', 'ja', 'ko', 'la', 'lv', 'nl', 'no', 'pl', 'pt', 'ro', 'sv', 'tr', 'uk', 'vi', 'zh', 'fa',
] as const satisfies readonly NonNullable<MasterLanguages>[number][];

export type LanguageCode = typeof VALID_LANGUAGE_CODES[number];

export const LANGUAGE_NAMES: Record<LanguageCode, string> = {
  ar: 'Arabic',
  bn: 'Bengali',
  da: 'Danish',
  de: 'German',
  en: 'English',
  es: 'Spanish',
  fi: 'Finnish',
  fr: 'French',
  hr: 'Croatian',
  hi: 'Hindi',
  is: 'Icelandic',
  it: 'Italian',
  ja: 'Japanese',
  ko: 'Korean',
  la: 'Latin',
  lv: 'Latvian',
  nl: 'Dutch',
  no: 'Norwegian',
  pl: 'Polish',
  pt: 'Portuguese',
  ro: 'Romanian',
  sv: 'Swedish',
  tr: 'Turkish',
  uk: 'Ukrainian',
  vi: 'Vietnamese',
  zh: 'Chinese',
  fa: 'Persian',
};
