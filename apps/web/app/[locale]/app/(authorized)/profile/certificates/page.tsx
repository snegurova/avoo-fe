'use client';

import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';
import { IconButton } from '@/_components/IconButton/IconButton';
import { routerHooks } from '@/_hooks/routerHooks';
import { AppRoutes } from '@/_routes/routes';
import { CertificatesList } from '@/_components/CertificatesList/CertificatesList';
import { CertificateAdd } from '@/_components/CertificateAdd/CertificateAdd';
import { localizationHooks } from '@/_hooks/localizationHooks';

export default function CertificatesPage() {
  const handleBackClick = routerHooks.useBackWithFallback(
    localizationHooks.useWithLocale(AppRoutes.Profile),
  );

  return (
    <div className='container mx-auto p-4 max-w-4xl'>
      <IconButton icon='⬅' onClick={handleBackClick} ariaLabel='Back' />
      <SectionHeader title='Certificates' />
      <div className='bg-white border border-gray-200 rounded-lg p-6'>
        <div className='overflow-auto px-4'>
          <CertificatesList />
          <CertificateAdd />
        </div>
      </div>
    </div>
  );
}
