'use client';

import { useRouter } from 'next/navigation';
import { AppRoutes } from '@/_routes/routes';
import { IconButton } from '@/_components/IconButton/IconButton';
import { localizationHooks } from '@/_hooks/localizationHooks';

export const ProfileCertificates = () => {
  const router = useRouter();

  const handleNavigate = () => {
    router.push(localizationHooks.useWithLocale(AppRoutes.Certificates));
  };

  return (
    <div className='flex items-center justify-between px-5 py-3'>
      <div className='flex items-center gap-2'>
        <span className='text-base text-slate-900'>Certificates</span>
      </div>
      <IconButton icon='✏️' onClick={handleNavigate} ariaLabel='Edit Certificates' />
    </div>
  );
};
