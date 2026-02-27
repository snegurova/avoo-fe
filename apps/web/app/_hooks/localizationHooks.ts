'use client';

import { AppRoutes } from '@/_routes/routes';
import { Route } from 'next';
import { useParams } from 'next/navigation';
export const localizationHooks = {
  useGetLocale() {
    const { locale } = useParams<{ locale: string }>();
    return locale;
  },
  useWithLocale(path: AppRoutes) {
    const locale = localizationHooks.useGetLocale();
    return `/${locale}${path}` as Route;
  },
};
