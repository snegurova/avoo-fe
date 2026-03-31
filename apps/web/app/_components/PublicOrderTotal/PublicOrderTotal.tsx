import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import dayjs from 'dayjs';

import {
  Combination,
  CreateOrder,
  MasterWithRelationsEntity,
  Service,
} from '@avoo/axios/types/apiTypes';
import { LONG_DATE_TIME_FORMAT } from '@avoo/constants';

type Props = {
  fields: CreateOrder[];
  selectedServices: (Service | null)[];
  selectedMasters: (MasterWithRelationsEntity | null)[];
  selectedCombinations: (Combination | null)[];
};

export default function PublicOrderTotal(props: Props) {
  const { fields, selectedServices, selectedMasters, selectedCombinations } = props;
  const t = useTranslations('public.salon.createOrder');
  const isCombination = useMemo(() => !!selectedCombinations?.[0], [selectedCombinations]);

  return (
    <div className='py-3 text-sm'>
      <div className='flex flex-col gap-4 text-black py-4 border-t border-black'>
        {fields.length > 0 &&
          !isCombination &&
          fields.map((order, idx) => {
            const service = selectedServices[idx];
            const master = selectedMasters[idx];

            const duration = service?.durationMinutes || 0;
            return (
              <div key={idx} className='grid grid-cols-2 md:grid-cols-4 gap-2 '>
                <span className='text-gray-600 row-span-3 md:row-span-1'>
                  {t('service')} {idx + 1}:
                </span>
                <span className='font-semibold'>
                  {service?.name} (
                  <span className={isCombination ? 'line-through text-gray-600 font-base' : ''}>
                    {duration} {t('minutes')}
                  </span>
                  )
                </span>
                <span className='font-semibold'>{master?.name}</span>
                <span className='font-semibold'>
                  {dayjs(order.date).format(LONG_DATE_TIME_FORMAT)}
                </span>
              </div>
            );
          })}
        {fields.length > 0 &&
          isCombination &&
          selectedServices.map((service, idx) => {
            const duration = service?.durationMinutes || 0;
            return (
              <div key={idx} className='grid grid-cols-2 md:grid-cols-4 gap-2 '>
                <span className='text-gray-600 row-span-3 md:row-span-1'>
                  {t('service')} {idx + 1}:
                </span>
                <span className='font-semibold'>
                  {service?.name} (
                  <span className={isCombination ? 'line-through text-gray-600 font-base' : ''}>
                    {duration} {t('minutes')}
                  </span>
                  )
                </span>
                <span className='font-semibold'>{selectedMasters[0]?.name}</span>
                <span className='font-semibold'></span>
              </div>
            );
          })}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-2'>
          <span className='text-gray-600'>{t('total')}:</span>

          <span className='font-bold text-base'>
            {selectedServices
              .reduce((sum, service) => sum + (service?.price || 0), 0)
              .toLocaleString()}{' '}
            {t('euro')}{' '}
            <span className='font-normal text-gray-600 text-xs'>
              (
              {isCombination
                ? selectedCombinations[0]?.durationMinutes
                : selectedServices.reduce(
                    (sum, service) => sum + (service?.durationMinutes || 0),
                    0,
                  )}{' '}
              {t('minutes')})
            </span>
          </span>
        </div>
      </div>
    </div>
  );
}
