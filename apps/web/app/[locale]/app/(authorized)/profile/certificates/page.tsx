'use client';

import { useTranslations } from 'next-intl';

import { CertificateAdd } from '@/_components/CertificateAdd/CertificateAdd';
import { CertificatesList } from '@/_components/CertificatesList/CertificatesList';
import { IconButton } from '@/_components/IconButton/IconButton';
import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { routerHooks } from '@/_hooks/routerHooks';
import { AppRoutes } from '@/_routes/routes';

export default function CertificatesPage() {
  const t = useTranslations('private.profile.certificates');
  const handleBackClick = routerHooks.useBackWithFallback(
    localizationHooks.useWithLocale(AppRoutes.Profile),
  );

  return (
    <div className='container mx-auto p-4 max-w-4xl'>
      <IconButton icon='⬅' onClick={handleBackClick} ariaLabel={t('back')} />
      <SectionHeader title={t('certificates')} />
      <div className='bg-white border border-gray-200 rounded-lg p-6'>
        <div className='overflow-auto px-4'>
          <CertificatesList />
          <CertificateAdd />
        </div>
      </div>
    </div>
  );
}
