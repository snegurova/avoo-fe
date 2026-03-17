'use client';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { localizationHooks } from '@/_hooks/localizationHooks';
import { AppRoutes } from '@/_routes/routes';

export default function SalonPublicPage() {
  const t = useTranslations('public.salon.page');
  const params = useParams();
  const userId = params.userId;
  return (
    <div className='container flex flex-col items-center gap-10'>
      <Link
        href={`${localizationHooks.useWithLocale(AppRoutes.PublicSalon)}/${userId}${AppRoutes.PublicOrderCreate}`}
      >
        {t('ctaButton')}
      </Link>
    </div>
  );
}
