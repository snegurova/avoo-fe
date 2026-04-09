'use client';

import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import useMediaQuery from '@mui/material/useMediaQuery';

import { userHooks } from '@avoo/hooks';

import { AddPhotosTrigger } from '@/_components/AddPhotosTrigger/AddPhotosTrigger';
import { GalleryPagination } from '@/_components/GalleryPagination/GalleryPagination';
import ProfileGalleryAdd from '@/_components/ProfileGalleryAdd/ProfileGalleryAdd';
import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';
import { getWideIndexes } from '@/_utils/galleryGrid';

export const ProfileGallery = () => {
  const t = useTranslations('private.components.ProfileGallery.ProfileGallery');
  const tabletUp = useMediaQuery('(min-width:768px)');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const LIMIT = 4;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } =
    userHooks.useGetUserMediaList(LIMIT);
  const { userId } = userHooks.useGetUserProfile();

  const medias = useMemo(
    () =>
      (data?.pages ?? [])
        .flatMap((page) => page?.data?.items ?? [])
        .filter((item) => item && (item.url || item.previewUrl)),
    [data],
  );
  const total = data?.pages?.[0]?.data?.pagination?.total ?? null;
  const hasItems = medias.length > 0;

  const [visibleCount, setVisibleCount] = useState(LIMIT);
  const prevMediasLength = useRef(medias.length);
  const displayedMedias = medias.slice(0, visibleCount);

  useEffect(() => {
    if (medias.length > visibleCount && hasMorePhotos) {
      setVisibleCount((prev) => Math.min(prev + LIMIT, medias.length));
    }
    if (
      medias.length > prevMediasLength.current &&
      displayedMedias.length === prevMediasLength.current
    ) {
      setVisibleCount((prev) => Math.min(prev + LIMIT, medias.length));
    }
    prevMediasLength.current = medias.length;
  }, [medias.length]);

  const perRow = tabletUp ? 4 : 2;
  const wideIndexes = useMemo(
    () => getWideIndexes(perRow, displayedMedias.length, tabletUp),
    [perRow, displayedMedias.length, tabletUp],
  );

  const hasMorePhotos = total == null ? true : medias.length < total;
  const canShowMore = displayedMedias.length < medias.length || hasMorePhotos;

  const handleAddPhotosClick = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);
  const handleSeeMore = () => {
    if (!hasMorePhotos && displayedMedias.length >= medias.length) return;
    if (displayedMedias.length < medias.length) {
      setVisibleCount((prev) => Math.min(prev + LIMIT, medias.length));
      return;
    }
    if (hasMorePhotos && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  const firstPhotoRef = useRef<HTMLLIElement | null>(null);
  const lastPhotoRef = useRef<HTMLLIElement | null>(null);

  useEffect(() => {
    if (lastPhotoRef.current && visibleCount > LIMIT) {
      lastPhotoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [visibleCount]);

  const handleChange = () => {
    setVisibleCount(LIMIT);
    refetch();
    if (firstPhotoRef.current) {
      firstPhotoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <>
      <div>
        <SectionHeader title={t('gallery')} onEdit={handleAddPhotosClick} />

        {hasItems && (
          <GalleryPagination
            hasMore={canShowMore}
            showSeeLess={displayedMedias.length > LIMIT}
            onLoadMore={canShowMore ? handleSeeMore : () => {}}
            onSeeLess={handleChange}
            seeMoreText={t('seeMore')}
            seeLessText={t('seeLess')}
          >
            <ul
              className={`grid ${tabletUp ? 'grid-cols-5' : 'grid-cols-3'} grid-flow-row-dense gap-1 md:gap-2 auto-rows-[165px] md:auto-rows-[180px]`}
            >
              {displayedMedias.map((item, index) => {
                const isWide = wideIndexes.has(index);
                const isFirst = index === 0;
                const isLast = index === displayedMedias.length - 1;
                let liRef: RefObject<HTMLLIElement | null> | undefined;
                if (isFirst) liRef = firstPhotoRef;
                if (isLast) liRef = lastPhotoRef;
                return (
                  <li
                    key={item.id + '_' + (item.url || item.previewUrl)}
                    className={`overflow-hidden rounded-lg ${isWide ? 'col-span-2' : 'col-span-1'}`}
                    ref={liRef}
                  >
                    <img
                      src={item.url ?? item.previewUrl}
                      alt={t('gallery')}
                      className='h-full w-full object-cover'
                    />
                  </li>
                );
              })}
            </ul>
          </GalleryPagination>
        )}

        {!hasItems && (
          <div className='py-8 text-center'>
            <p className='mb-4 text-md font-semibold text-slate-900'>{t('galleryEmpty')}</p>
            <p className='mx-auto max-w-[340px] text-sm leading-6 text-slate-400'>
              <AddPhotosTrigger onClick={handleAddPhotosClick}>{t('addPhotos')}</AddPhotosTrigger>{' '}
              {t('addPhotosDescription')}
            </p>
          </div>
        )}
      </div>

      <ProfileGalleryAdd
        open={isModalOpen}
        onClose={handleCloseModal}
        onChange={handleChange}
        medias={medias}
        totalMedias={total}
        userId={userId}
      />
    </>
  );
};
