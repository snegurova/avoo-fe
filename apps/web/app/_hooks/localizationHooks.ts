'use client';

import { Route } from 'next';
import { useParams } from 'next/navigation';

import { Locale } from '@avoo/intl';

import { AppRoutes } from '@/_routes/routes';

export const localizationHooks = {
  useGetLocale(): Locale {
    const { locale } = useParams<{ locale: string }>();
    return locale as Locale;
  },
  useWithLocale(path: AppRoutes) {
    const locale = localizationHooks.useGetLocale();
    return `/${locale}${path}` as Route;
  },
};
