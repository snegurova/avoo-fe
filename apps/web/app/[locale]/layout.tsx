import React from 'react';
import { redirect } from 'next/navigation';
import { Metadata } from 'next/types';

import { DEFAULT_LOCALE, Locale, SUPPORTED_LOCALES } from '@avoo/intl';

import DateLocalizationProvider from '@/_providers/DateLocalizationProvider';
import { LocaleProvider } from '@/_providers/LocaleProvider';
import { QueryProvider } from '@/_providers/QueryProvider';
import { MUIThemeProvider } from '@/_providers/ThemeProvider';

import { SnackbarProvider } from '../_providers/SnackbarContextProvider';

import '../../styles/globals.css';

export const metadata: Metadata = {
  title: 'AVOO App',
  description: 'AVOO professional platform',
};

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export default async function RootLayout(props: Props) {
  const { children, params } = props;

  const isLocale = (value: string): value is Locale => {
    return SUPPORTED_LOCALES.includes(value as Locale);
  };

  const { locale } = await params;

  if (!isLocale(locale)) {
    redirect(`/${DEFAULT_LOCALE}`);
  }

  return (
    <html lang={locale}>
      <body>
        <LocaleProvider locale={locale}>
          <MUIThemeProvider>
            <DateLocalizationProvider>
              <QueryProvider>
                <SnackbarProvider>{children}</SnackbarProvider>
              </QueryProvider>
            </DateLocalizationProvider>
          </MUIThemeProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}
