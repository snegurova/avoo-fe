import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { tv } from 'tailwind-variants';

import { Service } from '@avoo/axios/types/apiTypes';
import { categoriesHooks, servicesHooks } from '@avoo/hooks';

import GalleryModal from '@/_components/GalleryModal/GalleryModal';
import PublicServiceCard from '@/_components/PublicServiceCard/PublicServiceCard';
import ScheduleIcon from '@/_icons/ScheduleIcon';

type Props = {
  userId: number;
};

const button = tv({
  base: 'px-5.5 lg:px-2 py-2 rounded-full lg:rounded-lg border transition-colors text-sm leading-none text-black flex justify-between items-center gap-3 bg-white',
  variants: {
    active: {
      true: 'border-black',
      false: 'border-gray-200 hover:bg-gray-200 focus:bg-gray-200 cursor-pointer',
    },
  },
});

export default function SalonPageServicesTab(props: Props) {
  const [modalService, setModalService] = useState<Service | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalIndex, setModalIndex] = useState(0);
  const { userId } = props;
  const t = useTranslations('public.salon.page');

  const { queryParams, setCategory } = servicesHooks.usePublicServiceQuery(userId);

  const categories = categoriesHooks.useGetPublicCategoriesForUser({ userId });

  const {
    data,
    fetchNextPage: fetchNextServicesPage,
    hasNextPage: hasMoreServices,
    isFetching,
  } = servicesHooks.useGetPublicServicesInfinite({ ...queryParams, limit: 3 });

  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);

  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleCategoryClick = (categoryId?: number) => {
    setSelectedCategory(categoryId);
    setCategory(categoryId);
  };

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const entry = entries[0];
      if (entry.isIntersecting && hasMoreServices && !isFetching) {
        fetchNextServicesPage();
      }
    },
    [hasMoreServices, isFetching, fetchNextServicesPage],
  );

  useEffect(() => {
    const observer = new window.IntersectionObserver(handleObserver, {
      root: null,
      rootMargin: '0px',
      threshold: 0.1,
    });
    const sentinel = sentinelRef.current;
    if (sentinel) {
      observer.observe(sentinel);
    }
    return () => {
      if (sentinel) observer.unobserve(sentinel);
    };
  }, [handleObserver]);

  const services = useMemo(
    () => data?.pages.flatMap((page) => page?.data?.items).filter((item) => !!item) || [],
    [data],
  );

  const handleModalIndexChange = (newIndex: number) => {
    setModalIndex(newIndex);
  };

  return (
    <div className='pb-8 xl:pb-11 pt-4 xl:pt-8 lg:grid lg:grid-cols-4'>
      <div className='sticky lg:static top-0 '>
        <div className='lg:sticky lg:top-4 xl:top-6 flex lg:flex-col gap-3 py-2 lg:py-0 overflow-x-auto whitespace-nowrap lg:whitespace-normal bg-gray-50 lg:bg-transparent px-5 lg:px-0'>
          <button
            className={button({ active: selectedCategory === undefined })}
            onClick={() => handleCategoryClick(undefined)}
          >
            <span>{t('allCategories')}</span>
            <span className='w-5 h-5 rounded-full border border-gray-100 flex items-center justify-center text-xs text-black shrink-0'>
              {categories?.total}
            </span>
          </button>
          {categories?.categories.map((cat) =>
            cat.totalServices ? (
              <button
                key={'category' + cat.category.id}
                className={button({ active: selectedCategory === cat.category.id })}
                onClick={() => handleCategoryClick(cat.category.id)}
              >
                <span>{t(cat.category.name)}</span>
                <span className='w-5 h-5 rounded-full border border-gray-100 flex items-center justify-center text-xs text-black shrink-0'>
                  {cat.totalServices}
                </span>
              </button>
            ) : null,
          )}
        </div>
      </div>

      <div className='px-5 md:px-11 lg:px-0 lg:col-span-3 flex flex-col gap-3 lg:pl-6 xl:pl-11 pt-6 lg:pt-0'>
        {services.length === 0 && (
          <div className='text-gray-500 text-center py-8'>{t('noServices')}</div>
        )}
        {services.map((service: Service) => (
          <PublicServiceCard
            key={'service' + service.id}
            service={service}
            onCardClick={() => {
              setModalService(service);
              setModalOpen(true);
            }}
          />
        ))}
        <div ref={sentinelRef} />
        {isFetching && <div className='text-center py-4 '>{t('loading')}</div>}
      </div>
      {modalOpen && modalService && (
        <GalleryModal
          images={
            modalService.medias && modalService.medias.length > 0 ? modalService.medias : undefined
          }
          initialIndex={modalIndex}
          onClose={() => setModalOpen(false)}
          onIndexChange={handleModalIndexChange}
        >
          <div className='flex flex-col items-center gap-4'>
            <h3 className='text-base text-black font-bold text-center'>{modalService.name}</h3>
            <p className='text-sm text-gray-600 text-center'>{modalService.description}</p>
            <div className='flex gap-11 items-center'>
              <div className='text-xs leading-tight text-gray-600 flex items-center gap-2'>
                <ScheduleIcon className='fill-current' />
                <span>
                  {modalService.durationMinutes} {t('minutes')}
                </span>
              </div>
              {modalService.masters && (
                <div className='text-xs leading-tight text-gray-600 flex items-center gap-2'>
                  <div
                    className='relative'
                    style={{ width: 20 + (modalService.masters.length - 1) * 12 }}
                  >
                    {modalService.masters.map((master, idx) => (
                      <div
                        key={'master' + master.id}
                        className={`h-5 w-5 rounded-full overflow-hidden bg-gray-200 ${idx === 0 ? '' : 'absolute top-0'}`}
                        style={{ left: idx * 12 }}
                      >
                        {master.avatarPreviewUrl && (
                          <img
                            src={master.avatarPreviewUrl}
                            alt={master.name}
                            className='w-full h-full object-cover'
                          />
                        )}
                      </div>
                    ))}
                  </div>
                  <span>
                    {modalService.masters.length}{' '}
                    {modalService.masters.length > 1 ? t('masters') : t('master')}
                  </span>
                </div>
              )}
            </div>
          </div>
        </GalleryModal>
      )}
    </div>
  );
}
