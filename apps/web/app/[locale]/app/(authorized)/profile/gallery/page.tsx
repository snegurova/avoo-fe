'use client';

import { useTranslations } from 'next-intl';

import { IconButton } from '@/_components/IconButton/IconButton';
import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';
import { routerHooks } from '@/_hooks/routerHooks';

export default function GalleryPage() {
  const t = useTranslations('private.profile.gallery');
  const handleBackClick = routerHooks.useHandleNavigateToHomeClick();

  return (
    <div className='container mx-auto p-4 max-w-4xl'>
      <IconButton icon='⬅' onClick={handleBackClick} ariaLabel={t('back')} />
      <SectionHeader title={t('gallery')} />
      <div className='bg-white border border-gray-200 rounded-lg p-6'>
        <p className='text-gray-500'>{t('galleryContentHere')}</p>
      </div>
    </div>
  );
}
