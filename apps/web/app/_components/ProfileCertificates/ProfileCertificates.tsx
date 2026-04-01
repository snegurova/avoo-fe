'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import useMediaQuery from '@mui/material/useMediaQuery';

import { masterHooks, userHooks } from '@avoo/hooks';

import { GalleryPagination } from '@/_components/GalleryPagination/GalleryPagination';
import { SectionHeader } from '@/_components/SectionHeader/SectionHeader';

import { ProfileCertificateAdd } from '../ProfileCertificateAdd/ProfileCertificateAdd';
import ProfileCertificateCard from '../ProfileCertificateCard/ProfileCertificateCard';

export const ProfileCertificates = () => {
  const t = useTranslations('private.components.ProfileCertificates.ProfileCertificates');
  const certificates = userHooks.useGetUserCertificates();
  const { visualProfileInfo } = userHooks.useGetUserProfile();
  const masters = masterHooks.useGetMastersProfileInfo()?.items;

  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = useCallback(() => {
    setIsModalOpen(true);
  }, []);
  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const certificatesArr = certificates?.items || [];
  const hasItems = certificatesArr.length > 0;
  const tabletUp = useMediaQuery('(min-width:768px)');
  const LIMIT = 2;
  const [visibleCount, setVisibleCount] = useState(LIMIT);

  const visibleCertificates = useMemo(
    () => certificatesArr.slice(0, visibleCount),
    [certificatesArr, visibleCount],
  );

  const mastersById = useMemo(
    () =>
      new Map(
        (masters ?? []).map((master) => [
          master.id,
          { name: master.name ?? `Master ${master.id}`, avatarUrl: master.avatarUrl ?? null },
        ]),
      ),
    [masters],
  );

  const canShowMore = visibleCount < certificatesArr.length;
  const showSeeLess = visibleCount > LIMIT;
  const firstCertificateRef = useRef<HTMLDivElement | null>(null);
  const lastCertificateRef = useRef<HTMLDivElement | null>(null);

  const getMasterName = (masterId: unknown) => {
    if (typeof masterId !== 'number') return visualProfileInfo.name ?? 'Salon';
    return mastersById.get(masterId)?.name ?? `Master ${masterId}`;
  };

  const getMasterAvatar = (masterId: unknown): string | null => {
    if (typeof masterId !== 'number') return visualProfileInfo.avatarUrl ?? null;
    return mastersById.get(masterId)?.avatarUrl ?? null;
  };

  const getDescription = (description: unknown) =>
    typeof description === 'string' ? description : '';

  const handleSeeMore = () => {
    setVisibleCount((prev) => Math.min(prev + LIMIT, certificatesArr.length));
  };
  const handleSeeLess = () => {
    setVisibleCount(LIMIT);
    if (firstCertificateRef.current) {
      firstCertificateRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  useEffect(() => {
    if (lastCertificateRef.current && visibleCount > LIMIT) {
      lastCertificateRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [visibleCount]);

  return (
    <>
      <div className=''>
        <SectionHeader title={t('certificates')} onEdit={handleOpenModal} />

        {!hasItems && (
          <div className='text-center py-8'>
            <p className='text-md font-semibold text-slate-900 mb-4'>{t('noCertificates')}</p>
            <p className='mx-auto max-w-[340px] text-sm leading-6 text-slate-400'>
              <button
                type='button'
                onClick={handleOpenModal}
                className='text-primary-300 underline hover:text-primary-400 transition-colors cursor-pointer bg-transparent border-0 p-0 m-0 font-inherit'
              >
                {t('addCertificates')}
              </button>{' '}
              {t('addCertificatesDescription')}
            </p>
          </div>
        )}

        {hasItems && (
          <GalleryPagination
            hasMore={canShowMore}
            showSeeLess={showSeeLess}
            onLoadMore={canShowMore ? handleSeeMore : () => {}}
            onSeeLess={handleSeeLess}
            seeMoreText={t('seeMore')}
            seeLessText={t('seeLess')}
          >
            <div
              className={
                tabletUp
                  ? 'flex flex-row flex-wrap gap-6 md:gap-6 xl:gap-6 justify-start'
                  : 'flex flex-col gap-6'
              }
            >
              {visibleCertificates.map((cert, index) => {
                const isFirst = index === 0;
                const isLast = index === visibleCertificates.length - 1;
                let cardRef: React.RefObject<HTMLDivElement | null> | undefined;
                if (isFirst) cardRef = firstCertificateRef;
                if (isLast) cardRef = lastCertificateRef;

                return (
                  <div key={cert.id} ref={cardRef}>
                    <ProfileCertificateCard
                      imageUrl={cert.url}
                      title={cert.title}
                      date={cert.issueDate.slice(0, 10)}
                      master={getMasterName(cert.masterId)}
                      masterAvatarUrl={getMasterAvatar(cert.masterId)}
                      description={getDescription(cert.description)}
                    />
                  </div>
                );
              })}
            </div>
          </GalleryPagination>
        )}
      </div>
      <ProfileCertificateAdd open={isModalOpen} onClose={handleCloseModal} />
    </>
  );
};
