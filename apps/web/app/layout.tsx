import React from 'react';
import '../styles/globals.css';
import { QueryProvider } from '@/_providers/QueryProvider';
import { Metadata } from 'next/types';
import { MUIThemeProvider } from '@/_providers/ThemeProvider';

export const metadata: Metadata = {
  title: 'AVOO App',
  description: 'AVOO professional platform',
};

type Props = {
  children: React.ReactNode;
};

export default function RootLayout(props: Props) {
  const { children } = props;

  return (
    <html lang='en'>
      <body>
        <MUIThemeProvider>
          <QueryProvider>{children}</QueryProvider>
        </MUIThemeProvider>
      </body>
    </html>
  );
}
