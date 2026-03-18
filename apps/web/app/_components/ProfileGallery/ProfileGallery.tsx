'use client';

import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { userHooks } from '@avoo/hooks';

import { LocalizedLink } from '@/_components/LocalizedLink/LocalizedLink';
import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { AppRoutes } from '@/_routes/routes';

export const ProfileGallery = () => {
  const t = useTranslations('private.components.ProfileGallery.ProfileGallery');
  const userMedia = userHooks.useGetUserMedia();
  const router = useRouter();
  const galleryPath = localizationHooks.useWithLocale(AppRoutes.Gallery);

  const handleNavigateToGallery = useCallback(() => {
    router.push(galleryPath);
  }, [router, galleryPath]);

  const handleNavigate = useCallback(() => {
    handleNavigateToGallery();
  }, [handleNavigateToGallery]);

  const hasItems = userMedia?.items && userMedia.items.length > 0;

  return (
    <div className=''>
      <SectionHeader title={t('gallery')} onEdit={handleNavigate} />

      {hasItems && (
        <div className='flex gap-3 overflow-x-auto'>
          {userMedia.items.map((item) => (
            <div key={item.id} className='bg-gray-200 rounded-lg w-20 h-20 flex-shrink-0' />
          ))}
        </div>
      )}

      {!hasItems && (
        <div className='text-center py-8'>
          <p className='text-md font-semibold text-slate-900 mb-4'>{t('galleryEmpty')}</p>
          <p className='text-sm text-slate-400 max-w-[340px] mx-auto leading-6'>
            {t.rich('addPhotosRich', {
              a: (chunks) => (
                <LocalizedLink href={AppRoutes.Gallery} className='text-primary-300'>
                  {chunks}
                </LocalizedLink>
              ),
            })}
          </p>
        </div>
      )}
    </div>
  );
};
