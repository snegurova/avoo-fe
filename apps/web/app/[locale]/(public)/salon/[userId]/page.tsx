'use client';
import React from 'react';
import { useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { userHooks } from '@avoo/hooks';
import { useReferralStore } from '@avoo/store';

import PublicWrapper from '@/_components/PublicWrapper/PublicWrapper';
import SalonPageTabsPanel from '@/_components/SalonPageTabsPanel/SalonPageTabsPanel';
import SalonPageTop from '@/_components/SalonPageTop/SalonPageTop';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { AppRoutes } from '@/_routes/routes';

export default function SalonPublicPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const userId = params.userId;
  const setReferralCode = useReferralStore((s) => s.setReferralCode);

  useEffect(() => {
    const code = searchParams.get('referralCode');
    if (code) {
      setReferralCode(code);
    }
  }, [searchParams, setReferralCode]);

  const data = userHooks.useGetPublicUser(userId ? Number(userId) : 0);

  const t = useTranslations('public.salon.page');

  return (
    <PublicWrapper classes='lg:px-11 text-gray-600'>
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
    </PublicWrapper>
  );
}
