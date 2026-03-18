import React, { useCallback, useEffect, useRef, useState } from 'react';

import { tv } from 'tailwind-variants';

import type { Service } from '@avoo/axios/types/apiTypes';
import { categoriesHooks, servicesHooks } from '@avoo/hooks';

import ScheduleIcon from '@/_icons/ScheduleIcon';

type Props = {
  userId: number;
};

const button = tv({
  base: 'px-2 py-3 rounded-lg border transition-colors text-sm leading-none text-black flex justify-between items-center gap-2',
  variants: {
    active: {
      true: 'border-black',
      false: 'border-gray-200 hover:bg-gray-200 focus:bg-gray-200 cursor-pointer',
    },
  },
});

export default function SalonPageServicesTab(props: Props) {
  const { userId } = props;

  const { queryParams, setCategory } = servicesHooks.usePublicServiceQuery(userId);

  const categories = categoriesHooks.useGetPublicCategories();

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

  const services = data?.pages.flatMap((page) => page.data?.items ?? []) ?? [];

  return (
    <div className='pb-11 pt-8 lg:grid lg:grid-cols-4'>
      <div>
        <div className='sticky top-6 flex flex-col gap-2'>
          <button
            className={button({ active: selectedCategory === undefined })}
            onClick={() => handleCategoryClick(undefined)}
          >
            <span>All categories</span>
          </button>
          {categories?.map((cat) => (
            <button
              key={cat.id}
              className={button({ active: selectedCategory === cat.id })}
              onClick={() => handleCategoryClick(cat.id)}
            >
              <span>{cat.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className='lg:col-span-3 flex flex-col gap-3 pl-11'>
        {services.length === 0 && (
          <div className='text-gray-500 text-center py-8'>No services found.</div>
        )}
        {services.map((service: Service) => (
          <div
            key={service.id}
            className='px-4 py-3 border rounded-lg border-gray-200 flex flex-col gap-5'
          >
            <div className=''>
              <h3 className='text-base text-black'>{service.name}</h3>
              <p className='text-xs mt-2'>{service.description}</p>
            </div>
            <div className='flex justify-between gap-4 items-center'>
              <div className='text-xs leading-tight flex items-center gap-1'>
                <ScheduleIcon className='fill-current' />
                <span>{service.durationMinutes} mins</span>
              </div>
              <span className='text-sm text-black leading-none font-medium'>
                {service.price} Euro
              </span>
            </div>
          </div>
        ))}
        <div ref={sentinelRef} />
        {isFetching && <div className='text-center py-4 '>Loading...</div>}
      </div>
    </div>
  );
}
