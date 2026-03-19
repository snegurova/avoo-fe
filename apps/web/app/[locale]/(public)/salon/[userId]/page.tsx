'use client';
import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { userHooks } from '@avoo/hooks';

import LanguageSwitcher from '@/_components/LanguageSwitcher/LanguageSwitcher';
import SalonPageTabsPanel from '@/_components/SalonPageTabsPanel/SalonPageTabsPanel';
import SalonPageTop from '@/_components/SalonPageTop/SalonPageTop';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { AppRoutes } from '@/_routes/routes';

export default function SalonPublicPage() {
  const params = useParams();
  const userId = params.userId;

  const data = userHooks.useGetPublicUser(userId ? Number(userId) : 0);

  const t = useTranslations('public.salon.page');

  return (
    <div className='min-h-screen flex flex-col'>
      <header className='border-b border-gray-200 2xl:border-b-0'>
        <div className='container mx-auto'>
          <div className='2xl:border-b border-gray-200 py-2 flex items-center justify-end gap-4 px-6'>
            <LanguageSwitcher type='public' />
          </div>
        </div>
      </header>
      <div className='container lg:px-11 mx-auto text-gray-600 flex-1 flex flex-col'>
        <SalonPageTop data={data} userId={userId ? Number(userId) : 0} />
        <SalonPageTabsPanel userId={userId ? Number(userId) : 0} data={data} />
        <div className='sticky bottom-0 bg-white py-4 flex justify-center lg:hidden border border-gray-200'>
          <Link
            href={`${localizationHooks.useWithLocale(AppRoutes.PublicSalon)}/${userId}${AppRoutes.PublicOrderCreate}`}
            className='font-semibold bg-black rounded-lg p-3.5 justify-center text-white border-black transition-colors hover:bg-white focus:bg-white hover:text-black focus:text-black border flex min-w-80'
          >
            {t('ctaButton')}
          </Link>
        </div>
      </div>
      <footer>
        <div className='container mx-auto'>
          <div className='border-t border-gray-200 py-3 flex items-center justify-between gap-4 px-6'>
            <a
              href='#'
              className='text-sm leading-[1.1] text-gray-600 hover:text-primary-500 focus:primary-500 transition-colors'
            >
              {t('termsPrivacy')}
            </a>
            <span className='text-sm leading-[1.1] text-gray-600'>
              © {new Date().getFullYear()} Avoo. {t('allRightsReserved')}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
