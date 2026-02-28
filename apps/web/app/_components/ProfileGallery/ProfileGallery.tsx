'use client';

import { useRouter } from 'next/navigation';
import { userHooks } from '@avoo/hooks';
import { AppRoutes } from '@/_routes/routes';
import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { LocalizedLink } from '@/_components/LocalizedLink/LocalizedLink';

export const ProfileGallery = () => {
  const userMedia = userHooks.useGetUserMedia();
  const router = useRouter();

  const handleNavigate = () => {
    router.push(localizationHooks.useWithLocale(AppRoutes.Gallery));
  };

  const hasItems = userMedia?.items && userMedia.items.length > 0;

  return (
    <div className='px-5 py-4 border-t border-gray-200'>
      <SectionHeader title='Gallery' onEdit={handleNavigate} />

      {hasItems && (
        <div className='flex gap-3 overflow-x-auto'>
          {userMedia.items.map((item) => (
            <div key={item.id} className='bg-gray-200 rounded-lg w-20 h-20 flex-shrink-0' />
          ))}
        </div>
      )}

      {!hasItems && (
        <div className='text-center py-8'>
          <p className='text-sm text-slate-500 mb-2'>Show clients your place and service</p>
          <LocalizedLink
            href={AppRoutes.Gallery}
            className='text-sm text-blue-600 underline'
          >
            Add gallery
          </LocalizedLink>
        </div>
      )}
    </div>
  );
};
