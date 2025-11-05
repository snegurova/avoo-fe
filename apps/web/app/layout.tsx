import React from 'react';
import '../styles/globals.css';
import { QueryProvider } from './_providers/QueryProvider';

export const metadata = {
  title: 'AVOO App',
  description: 'AVOO professional platform',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en'>
      <body>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
