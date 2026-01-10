'use client';
import React, { ReactNode, useState } from 'react';
import { AuthGuard } from '@/_components/AuthGuard/AuthGuard';
import AppNavigation from '@/_components/AppNavigation/AppNavigation';
import AppHeader from '@/_components/AppHeader/AppHeader';

export default function AppLayout({ children }: { children: ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <AuthGuard>
      <div className='flex h-screen max-w-full overflow-hidden'>
        <AppNavigation menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <div className='w-full lg:w-[calc(100%-220px)] h-screen pt-9 md:pl-6 lg:pl-8 md:pr-6 pb-6 flex flex-col gap-9 bg-primary-50'>
          <AppHeader setMenuOpen={setMenuOpen} />
          <main className='flex-1 flex overflow-auto'>{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
