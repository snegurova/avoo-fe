import React, { ReactNode } from 'react';
import { AuthGuard } from '@/_components/AuthGuard/AuthGuard';
import AppNavigation from '@/_components/AppNavigation/AppNavigation';
import AppHeader from '@/_components/AppHeader/AppHeader';

export default function AppLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className='flex h-screen max-w-full overflow-hidden'>
        <AppNavigation />
        <div className='w-[calc(100%-220px)] h-screen pt-9 pl-8 pr-6 pb-6 flex flex-col gap-9 bg-primary-50'>
          <AppHeader />
          <main className='flex-1 flex overflow-auto'>{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
