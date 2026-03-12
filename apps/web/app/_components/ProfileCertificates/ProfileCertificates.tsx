'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { userHooks } from '@avoo/hooks';

import { LocalizedLink } from '@/_components/LocalizedLink/LocalizedLink';
import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { AppRoutes } from '@/_routes/routes';

export const ProfileCertificates = () => {
  const certificates = userHooks.useGetUserCertificates();
  const router = useRouter();
  const certificatesPath = localizationHooks.useWithLocale(AppRoutes.Certificates);

  const handleNavigateToCertificates = useCallback(() => {
    router.push(certificatesPath);
  }, [router, certificatesPath]);

  const handleNavigate = useCallback(() => {
    handleNavigateToCertificates();
  }, [handleNavigateToCertificates]);

  const hasItems = (certificates?.items?.length ?? 0) > 0;

  return (
    <div className=''>
      <SectionHeader title='Certificates' onEdit={handleNavigate} />

      {!hasItems && (
        <div className='text-center py-8'>
          <p className='text-md font-semibold text-slate-900 mb-4'>No certificates added</p>
          <p className='text-sm text-slate-400 max-w-[340px] mx-auto leading-6'>
            <LocalizedLink href={AppRoutes.Certificates} className='text-primary-300'>
              Add certificates
            </LocalizedLink>{' '}
            to highlight your professional qualifications.
          </p>
        </div>
      )}
    </div>
  );
};
