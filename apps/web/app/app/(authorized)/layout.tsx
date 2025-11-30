import React, { ReactNode } from 'react';
import { AuthGuard } from '@/_components/AuthGuard/AuthGuard';
import AppNavigation from '@/_components/AppNavigation/AppNavigation';
import AppHeader from '@/_components/AppHeader/AppHeader';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <div className='flex h-screen'>
        <AppNavigation />
        <div className='w-full h-screen pt-9 pl-8 pr-6 pb-6 flex flex-col gap-9 bg-light'>
          <AppHeader />
          <main className='flex-1 flex overflow-hidden'>{children}</main>
        </div>
      </div>
    </AuthGuard>
  );
}
