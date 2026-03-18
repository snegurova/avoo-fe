'use client';

import { useTranslations } from 'next-intl';

import { LocalizedLink } from '@/_components/LocalizedLink/LocalizedLink';
import { AppRoutes } from '@/_routes/routes';

export default function HomePage() {
  const t = useTranslations('public.home.topSection');
  return (
    <div className='container flex flex-col items-center gap-10'>
      {t('title')}
      <LocalizedLink
        href={AppRoutes.Home}
        className='bg-primary-500 text-white py-2.5 px-4 rounded-2xl'
      >
        {t('ctaButton')}
      </LocalizedLink>
    </div>
  );
}
