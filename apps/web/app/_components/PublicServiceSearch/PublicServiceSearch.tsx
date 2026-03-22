'use client';
import React, { useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { tv } from 'tailwind-variants';

import { Service } from '@avoo/axios/types/apiTypes';
import { categoriesHooks } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';

import PublicOrderTitle from '@/_components/PublicOrderTitle/PublicOrderTitle';
import PublicServiceCard from '@/_components/PublicServiceCard/PublicServiceCard';

type Props = {
  setCategory: (categoryId?: number) => void;
  items: Service[];
  onChange: (value: { id: number }) => void;
  value: number | null;
  search: string;
  setSearch: (value: string) => void;
  hasMore: boolean;
  fetchNextPage: () => void;
  isActive: boolean;
  setStep: (step: number) => void;
  selectedService: Service | null;
  ref: React.Ref<HTMLDivElement>;
};

const button = tv({
  base: 'px-5.5 py-3 rounded-full  border transition-colors text-sm leading-none text-black flex justify-between items-center gap-2 bg-white',
  variants: {
    active: {
      true: 'border-black',
      false: 'border-gray-200 hover:bg-gray-200 focus:bg-gray-200 cursor-pointer',
    },
  },
});

export default function PublicServiceSearch(props: Props) {
  const {
    setCategory,
    items,
    onChange,
    isActive,
    setStep,
    selectedService,
    search,
    setSearch,
    fetchNextPage,
    hasMore,
    ref,
  } = props;
  const t = useTranslations('public.salon.page');
  const listRef = useRef<HTMLDivElement>(null);
  const isPending = useApiStatusStore((state) => state.isPending);

  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);

  const categories = categoriesHooks.useGetPublicCategories();

  const handleCategoryClick = (categoryId?: number) => {
    setSelectedCategory(categoryId);
    setCategory(categoryId);
  };

  const onServiceClick = (id: number) => {
    onChange({ id });
    setStep(2);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!listRef.current || !hasMore || !fetchNextPage || isPending) return;
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;

    if (scrollHeight - scrollTop <= clientHeight + 50) {
      fetchNextPage();
    }
  };

  const onServiceClear = () => {
    onChange({ id: 0 });
    setStep(1);
  };

  return (
    <div ref={ref}>
      <PublicOrderTitle
        isActive={isActive}
        title='selectService'
        search={search}
        setSearch={setSearch}
        placeholder='searchServices'
      />
      {isActive && (
        <div className='flex flex-col'>
          <div className='sticky lg:static top-0 flex gap-y-2 gap-x-3 py-4 overflow-x-auto lg:overflow-visible whitespace-nowrap lg:flex-wrap'>
            <button
              className={button({ active: selectedCategory === undefined })}
              onClick={() => handleCategoryClick(undefined)}
            >
              <span>{t('allCategories')}</span>
            </button>
            {categories?.map((cat) => (
              <button
                key={cat.id}
                className={button({ active: selectedCategory === cat.id })}
                onClick={() => handleCategoryClick(cat.id)}
              >
                <span>{t(cat.name)}</span>
              </button>
            ))}
          </div>
          <div
            className='flex flex-col gap-3 max-h-[calc(100vh-200px)] overflow-y-auto'
            ref={listRef}
            onScroll={handleScroll}
          >
            {items.map((service) => (
              <PublicServiceCard
                key={service.id}
                service={service}
                onClick={() => onServiceClick(service.id)}
                isSelected={selectedService?.id === service.id}
              />
            ))}
          </div>
        </div>
      )}
      {!isActive && selectedService && (
        <PublicServiceCard
          service={selectedService}
          onClick={() => setStep(1)}
          type='change'
          onClear={onServiceClear}
        />
      )}
    </div>
  );
}
