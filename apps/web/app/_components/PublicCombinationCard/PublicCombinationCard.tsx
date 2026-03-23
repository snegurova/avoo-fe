import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { Combination } from '@avoo/axios/types/apiTypes';
import { currencyUtils, timeUtils } from '@avoo/shared';

import { CURRENCY } from '@/_constants/currency';

type Props = {
  item: Combination;
  onClick: () => void;
};

export default function PublicCombinationCard(props: Props) {
  const { item, onClick } = props;
  const t = useTranslations('public.salon.createOrder');

  const price = useMemo(() => {
    return item.services.reduce((acc, service) => acc + service.price, 0);
  }, [item.services]);

  return (
    <div className='p-6 border rounded-lg border-gray-200 text-gray-600 flex flex-col gap-4'>
      <h3 className='sr-only'>{item.name}</h3>
      <ul className='flex flex-col gap-2'>
        {item.services.map((service) => (
          <li
            key={`combination-service-${service.id}`}
            className='flex items-center gap-4 justify-between'
          >
            <div className='flex items-center gap-2'>
              <span className='text-sm font-medium'>{service.name}</span>
              <span className='text-gray-600 line-through text-xs'>
                {timeUtils.convertDuration(service.durationMinutes)}
              </span>
            </div>
            <span className='text-sm text-gray-600'>
              {currencyUtils.formatPrice(service.price, CURRENCY)}
            </span>
          </li>
        ))}
      </ul>
      <div className='flex items-center gap-4 justify-between'>
        <p className=' text-gray-600'>{timeUtils.convertDuration(item.durationMinutes)}</p>
        <p className='text-base'>{currencyUtils.formatPrice(price, CURRENCY)}</p>
      </div>

      <button
        type='button'
        onClick={onClick}
        className='font-semibold bg-black rounded-lg py-3.5 px-5 justify-center text-white border-black transition-colors hover:bg-white focus:bg-white hover:text-black focus:text-black border cursor-pointer leading-none self-end'
      >
        {t('splitBooking')}
      </button>
    </div>
  );
}
