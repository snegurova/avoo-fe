'use client';
import React, { useState } from 'react';
import { useTranslations } from 'next-intl';

import { tv } from 'tailwind-variants';

import { Service } from '@avoo/axios/types/apiTypes';
import { categoriesHooks } from '@avoo/hooks';

import PublicServiceCard from '@/_components/PublicServiceCard/PublicServiceCard';
import ScheduleIcon from '@/_icons/ScheduleIcon';

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
  setStep: (step: number) => void;
  selectedService: Service | null;
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
  const { setCategory, items, onChange, isActive, setStep, selectedService } = props;
  const t = useTranslations('public.salon.page');

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

  return (
    <div>
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
      {!isActive && selectedService && (
        <div className='border border-gray-200 rounded-lg p-6 flex flex-col gap-3.5'>
          <h3 className='text-black text-base'>{selectedService.name}</h3>
          <div className='flex justify-between gap-8 items-center'>
            <div className='flex gap-8 items-center'>
              <div className='text-xs leading-tight flex items-center gap-1'>
                <ScheduleIcon className='fill-current' />
                <span>
                  {selectedService.durationMinutes} {t('minutes')}
                </span>
              </div>
              <span className='text-sm text-black leading-none font-medium shrink-0'>
                {selectedService.price} {t('euro')}
              </span>
            </div>
            <button
              type='button'
              onClick={() => setStep(1)}
              className='font-medium text-sm leading-1.1 underline underline-offset-4 cursor-pointer transition-colors hover:text-primary-500 focus:text-primary-500'
            >
              {t('change')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
