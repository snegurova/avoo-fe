import React from 'react';
import { useTranslations } from 'next-intl';

import { Service } from '@avoo/axios/types/apiTypes';

import ScheduleIcon from '@/_icons/ScheduleIcon';

type Props = {
  service: Service;
  onClick?: () => void;
};

export default function PublicServiceCard(props: Props) {
  const { service, onClick } = props;
  const t = useTranslations('public.salon.page');

  const isClickable = Boolean(onClick);

  return (
    <div className='px-4 py-3 border rounded-lg border-gray-200 flex flex-col gap-5'>
      <div className=''>
        <h3 className='text-base text-black'>{service.name}</h3>
        <p className='text-xs mt-2'>{service.description}</p>
      </div>
      <div className='flex justify-between gap-4 items-center'>
        <div className={`flex justify-between gap-8 items-center ${!isClickable ? 'w-full' : ''}`}>
          <div className='text-xs leading-tight flex items-center gap-1'>
            <ScheduleIcon className='fill-current' />
            <span>
              {service.durationMinutes} {t('minutes')}
            </span>
          </div>
          <span className='text-sm text-black leading-none font-medium shrink-0'>
            {service.price} {t('euro')}
          </span>
        </div>
        {isClickable && (
          <button
            type='button'
            onClick={onClick}
            className='font-semibold bg-black rounded-lg py-3.5 px-5 justify-center text-white border-black transition-colors hover:bg-white focus:bg-white hover:text-black focus:text-black border cursor-pointer leading-none'
          >
            {t('book')}
          </button>
        )}
      </div>
    </div>
  );
}
