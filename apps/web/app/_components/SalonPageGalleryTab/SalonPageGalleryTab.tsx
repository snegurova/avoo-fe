import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { MEDIA_TYPE_ENUM } from '@avoo/axios/types/apiEnums';
import { MediaEntity } from '@avoo/axios/types/apiTypes';
import { mediaHooks } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';

import GalleryModal from '@/_components/GalleryModal/GalleryModal';

type Props = {
  userId: number;
};

export default function SalonPageGalleryTab(props: Props) {
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const { userId } = props;
  const listRef = useRef<HTMLDivElement>(null);
  const t = useTranslations('public.salon.page');
  const isPending = useApiStatusStore((state) => state.isPending);

  const { data, fetchNextPage, hasNextPage } = mediaHooks.useGetPublicMedia({
    limit: 7,
    type: MEDIA_TYPE_ENUM.USER,
    typeEntityId: userId,
    createdBy: userId,
  });

  const pictures = useMemo(
    () =>
      (data?.pages.flatMap((page) => page?.data?.items) || []).filter(
        (item): item is MediaEntity => item !== undefined,
      ),
    [data],
  );

  const handleModalIndexChange = useCallback(
    (newIndex: number) => {
      setModalIndex(newIndex);
      if (hasNextPage && fetchNextPage && newIndex >= pictures.length - 1 && !isPending) {
        fetchNextPage();
      }
    },
    [hasNextPage, fetchNextPage, pictures.length, isPending],
  );

  useEffect(() => {
    const handleWindowScroll = () => {
      if (!hasNextPage || !fetchNextPage || isPending) return;
      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = 200;
      const pageHeight = document.body.offsetHeight;
      if (pageHeight - scrollPosition < threshold) {
        fetchNextPage();
      }
    };
    window.addEventListener('scroll', handleWindowScroll);
    return () => {
      window.removeEventListener('scroll', handleWindowScroll);
    };
  }, [hasNextPage, fetchNextPage, isPending]);

  return (
    <div className='flex justify-center py-4 xl:py-8 flex-1 '>
      {modalOpen && (
        <GalleryModal
          images={pictures}
          initialIndex={modalIndex}
          onClose={() => setModalOpen(false)}
          onIndexChange={handleModalIndexChange}
        />
      )}
      {pictures.length < 1 && (
        <p className='max-w-160 px-5 text-center'>{t('galleryPlaceholder')}</p>
      )}
      {pictures.length > 1 && (
        <div
          className='grid grid-cols-3 md:grid-cols-4 xl:grid-cols-10 gap-y-1 gap-x-0.5 md:gap-x-3 md:gap-y-4 px-5 md:px-11 lg:px-0 w-full'
          ref={listRef}
        >
          {pictures.map((picture, idx) => (
            <button
              key={picture.id}
              className='h-41 md:h-78 overflow-hidden rounded-lg nth-[5n+4]:col-span-2 md:nth-[5n+4]:col-span-1 md:nth-[6n+2]:col-span-2 md:nth-[6n+6]:col-span-2 xl:nth-[6n+2]:col-span-1 xl:nth-[6n+6]:col-span-1 xl:nth-[7n+1]:col-span-2 xl:nth-[7n+2]:col-span-2 xl:nth-[7n+3]:col-span-2 xl:nth-[7n+4]:col-span-4 xl:nth-[7n+7]:col-span-4 xl:nth-[7n+5]:col-span-3 xl:nth-[7n+6]:col-span-3 cursor-pointer'
              type='button'
              onClick={() => {
                setModalOpen(true);
                setModalIndex(idx);
              }}
            >
              <img
                src={picture.url}
                alt={`Gallery image ${idx + 1}`}
                className='object-cover object-center h-full w-full'
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
