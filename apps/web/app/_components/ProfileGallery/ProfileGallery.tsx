'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import useMediaQuery from '@mui/material/useMediaQuery';

import type { MediaEntity } from '@avoo/axios/types/apiTypes';
import { userHooks } from '@avoo/hooks';

import { AddPhotosTrigger } from '@/_components/AddPhotosTrigger/AddPhotosTrigger';
import { GalleryPagination } from '@/_components/GalleryPagination/GalleryPagination';
import ProfileGalleryAdd from '@/_components/ProfileGalleryAdd/ProfileGalleryAdd';
import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';
import { fillRow, fillSimpleRow, getRowPattern } from '@/_utils/galleryGrid';

export const ProfileGallery = () => {
  const t = useTranslations('private.components.ProfileGallery.ProfileGallery');
  const LIMIT = 10;
  const [page, setPage] = useState(1);
  const [allMedias, setAllMedias] = useState<MediaEntity[]>([]);
  const [total, setTotal] = useState<number | null>(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const loadedPages = useRef<Set<number>>(new Set());

  const userMedia = userHooks.useGetUserMedia(page, LIMIT);
  const { userId } = userHooks.useGetUserProfile();
  const tabletUp = useMediaQuery('(min-width:768px)');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [visibleRows, setVisibleRows] = useState(1);

  useEffect(() => {
    if (userMedia?.items && !loadedPages.current.has(page)) {
      setAllMedias((prev) => {
        const existingIds = new Set(prev.map((media) => media.id));
        return [...prev, ...userMedia.items.filter((media) => !existingIds.has(media.id))];
      });
      setTotal(userMedia.pagination?.total ?? null);
      loadedPages.current.add(page);
      setIsLoadingMore(false);
    }
    if (page === 1 && userMedia?.items && allMedias.length === 0) {
      setAllMedias(userMedia.items);
      setTotal(userMedia.pagination?.total ?? null);
      loadedPages.current.add(1);
    }
  }, [userMedia, page]);

  const medias = allMedias;
  const hasItems = medias.length > 0;
  const { displayedMedias, wideIndexes, totalRows } = useMemo(() => {
    const result: typeof medias = [];
    const wideIdxs: number[] = [];
    let mediaIndex = 0;
    let row = 0;
    const perRow = tabletUp ? 4 : 2;
    const maxRows = Math.ceil(medias.length / perRow);
    const rowsToShow = Math.min(tabletUp ? visibleRows : visibleRows * 2, maxRows);
    const pattern = getRowPattern(tabletUp);
    while (mediaIndex < medias.length && row < rowsToShow) {
      const enoughForFullRow = tabletUp
        ? medias.length - mediaIndex >= 4
        : medias.length - mediaIndex >= 2;
      if (enoughForFullRow) {
        const wideInRow = pattern[row % pattern.length];
        mediaIndex = fillRow({
          startIdx: mediaIndex,
          perRow,
          wideInRow,
          medias,
          result,
          wideIdxs,
        });
      } else {
        mediaIndex = fillSimpleRow({ startIdx: mediaIndex, perRow, medias, result });
      }
      row++;
    }
    return { displayedMedias: result, wideIndexes: new Set(wideIdxs), totalRows: maxRows };
  }, [medias, tabletUp, visibleRows]);
  const hasMoreRows =
    (tabletUp && visibleRows < totalRows) || (!tabletUp && visibleRows * 2 < totalRows);
  const showSeeLess =
    !hasMoreRows && ((tabletUp && visibleRows > 1) || (!tabletUp && visibleRows > 1));
  const perRow = tabletUp ? 4 : 2;
  const nextVisibleRows = visibleRows + 1;
  const needPhotos = (tabletUp ? nextVisibleRows : nextVisibleRows * 2) * perRow;
  const hasMorePhotos = total == null ? true : medias.length < total;
  const handleAddPhotosClick = () => setIsModalOpen(true);
  const handleSeeMore = () => {
    if (showSeeLess) {
      setVisibleRows(1);
      return;
    }
    if (medias.length >= needPhotos) {
      setVisibleRows((prev) => prev + 1);
      return;
    }
    if (hasMorePhotos && !isLoadingMore) {
      setIsLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  };

  useEffect(() => {
    if (!isLoadingMore) return;
    if (medias.length >= needPhotos) {
      setVisibleRows((prev) => prev + 1);
      setIsLoadingMore(false);
    }
  }, [medias, isLoadingMore, needPhotos]);

  return (
    <>
      <div>
        <SectionHeader title={t('gallery')} onEdit={() => setIsModalOpen(true)} />

        {hasItems && (
          <GalleryPagination
            hasMore={hasMoreRows}
            showSeeLess={showSeeLess}
            onLoadMore={handleSeeMore}
            seeMoreText={t('seeMore')}
            seeLessText={t('seeLess')}
          >
            <ul className='grid grid-cols-3 md:grid-cols-5 grid-flow-row-dense gap-1 md:gap-2 auto-rows-[165px] md:auto-rows-[180px]'>
              {displayedMedias.map((item, index) => (
                <li
                  key={item.id + '_' + index}
                  className={`overflow-hidden rounded-lg ${wideIndexes.has(index) ? 'col-span-2' : 'col-span-1'}`}
                >
                  <img
                    src={item.previewUrl ?? item.url}
                    alt={t('gallery')}
                    className='h-full w-full object-cover'
                  />
                </li>
              ))}
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
        onClose={() => {
          setIsModalOpen(false);
          setVisibleRows(1);
          setPage(1);
          setAllMedias([]);
          setTotal(null);
          loadedPages.current = new Set();
        }}
        medias={medias}
        userId={userId}
      />
    </>
  );
};
