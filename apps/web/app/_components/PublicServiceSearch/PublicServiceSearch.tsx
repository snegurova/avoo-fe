'use client';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

import { tv } from 'tailwind-variants';

import { Service } from '@avoo/axios/types/apiTypes';
import { categoriesHooks } from '@avoo/hooks';

import PublicServiceCard from '../PublicServiceCard/PublicServiceCard';

type Props = {
  setCategory: (categoryId?: number) => void;
  items: Service[];
  onChange: (value: { id: number }) => void;
  value: number | null;
  search: string;
  setSearch: (value: string) => void;
  hasMore?: boolean;
  fetchNextPage?: () => void;
  isActive: boolean;
  nextStep: () => void;
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
  const { setCategory, items, onChange, isActive, nextStep } = props;
  const t = useTranslations('public.salon.page');

  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(undefined);

  const categories = categoriesHooks.useGetPublicCategories();

  const handleCategoryClick = (categoryId?: number) => {
    setSelectedCategory(categoryId);
    setCategory(categoryId);
  };

  const onServiceClick = (id: number) => {
    onChange({ id });
    nextStep();
  };

  return (
    <>
      {isActive && (
        <div className='flex flex-col gap-4'>
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
          <div className='flex flex-col gap-3'>
            {items.map((service) => (
              <PublicServiceCard
                key={service.id}
                service={service}
                onClick={() => onServiceClick(service.id)}
              />
            ))}
          </div>
        </div>
      )}
    </>
  );
}
