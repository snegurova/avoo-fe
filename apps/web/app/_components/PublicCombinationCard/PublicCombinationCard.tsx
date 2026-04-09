import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import { Combination } from '@avoo/axios/types/apiTypes';
import { currencyUtils, timeUtils } from '@avoo/shared';

import { CURRENCY } from '@/_constants/currency';
import { localizationHooks } from '@/_hooks/localizationHooks';

type Props = {
  item: Combination;
  onClick: () => void;
};

export default function PublicCombinationCard(props: Props) {
  const { item, onClick } = props;
  const t = useTranslations('public.salon.createOrder');
  const locale = localizationHooks.useGetLocale();

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
              <span className='text-sm font-medium text-black'>{service.name}</span>
              <span className='text-gray-600 line-through text-xs'>
                {timeUtils.convertDuration(service.durationMinutes, locale)}
              </span>
            </div>
            <span className='text-sm text-gray-600'>
              {currencyUtils.formatPrice(service.price, CURRENCY)}
            </span>
          </li>
        ))}
      </ul>
      <div className='flex items-center gap-4 justify-between'>
        <p className=' text-black'>{timeUtils.convertDuration(item.durationMinutes, locale)}</p>
        <p className='text-base text-black'>{currencyUtils.formatPrice(price, CURRENCY)}</p>
      </div>

      <button
        type='button'
        onClick={onClick}
        className='cursor-pointer transition-colors text-gray-600 font-medium text-sm leading-base hover:text-black focus:text-black underline self-end'
      >
        {t('splitBooking')}
      </button>
    </div>
  );
}
