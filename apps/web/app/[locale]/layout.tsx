import React from 'react';
import { redirect } from 'next/navigation';
import '../../styles/globals.css';

import { QueryProvider } from '@/_providers/QueryProvider';
import { Metadata } from 'next/types';
import { MUIThemeProvider } from '@/_providers/ThemeProvider';
import DateLocalizationProvider from '@/_providers/DateLocalizationProvider';
import { SnackbarProvider } from '../_providers/SnackbarContextProvider';
import { Locale, SUPPORTED_LOCALES, DEFAULT_LOCALE } from '@avoo/intl';
import { LocaleProvider } from '@/_providers/LocaleProvider';

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
