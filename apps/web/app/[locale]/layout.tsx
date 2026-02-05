import React from 'react';
import '../../styles/globals.css';

import { QueryProvider } from '@/_providers/QueryProvider';
import { Metadata } from 'next/types';
import { MUIThemeProvider } from '@/_providers/ThemeProvider';
import DateLocalizationProvider from '@/_providers/DateLocalizationProvider';
import { SnackbarProvider } from '../_providers/SnackbarContextProvider';
import { Locale } from '@avoo/intl';
import { LocaleProvider } from '@/_providers/LocaleProvider';

export const metadata: Metadata = {
  title: 'AVOO App',
  description: 'AVOO professional platform',
};

type Props = {
  children: React.ReactNode;
  params: { locale: Locale };
};

export default async function RootLayout(props: Props) {
  const { children, params } = props;

  const { locale } = await params;

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
