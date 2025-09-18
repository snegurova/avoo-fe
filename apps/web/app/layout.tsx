import '../styles/globals.css';
import React from 'react';

export const metadata = {
  title: 'AVOO — Web',
  description: 'Next.js App Router starter in Yarn+Turbo monorepo',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-slate-900">
        <div className="mx-auto max-w-3xl p-6">{children}</div>
      </body>
    </html>
  );
}
