'use client';
import React from 'react';
import { useParams } from 'next/navigation';

import { userHooks } from '@avoo/hooks';

import LanguageSwitcher from '@/_components/LanguageSwitcher/LanguageSwitcher';
import SalonPageTabsPanel from '@/_components/SalonPageTabsPanel/SalonPageTabsPanel';
import SalonPageTop from '@/_components/SalonPageTop/SalonPageTop';

export default function SalonPublicPage() {
  const params = useParams();
  const userId = params.userId;

  const data = userHooks.useGetPublicUser(userId ? Number(userId) : 0);

  return (
    <div className='min-h-screen flex flex-col'>
      <header className=''>
        <div className='container mx-auto'>
          <div className='border-b border-gray-200 py-2 flex items-center justify-end gap-4 px-6'>
            <LanguageSwitcher type='public' />
          </div>
        </div>
      </header>
      <div className='container px-11 mx-auto text-gray-600 flex-1 flex flex-col'>
        <SalonPageTop data={data} userId={userId ? Number(userId) : 0} />
        <SalonPageTabsPanel userId={userId ? Number(userId) : 0} data={data} />
      </div>
      <footer>
        <div className='container mx-auto'>
          <div className='border-t border-gray-200 py-3 flex items-center justify-between gap-4 px-6'>
            <a
              href='#'
              className='text-sm leading-[1.1] text-gray-600 hover:text-primary-500 focus:primary-500 transition-colors'
            >
              Terms & Privacy
            </a>
            <span className='text-sm leading-[1.1] text-gray-600'>
              © {new Date().getFullYear()} Avoo. All rights reserved.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
