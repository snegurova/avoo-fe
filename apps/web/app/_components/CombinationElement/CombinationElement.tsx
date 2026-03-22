import React, { useMemo } from 'react';
import { useLocale } from 'next-intl';

import { tv } from 'tailwind-variants';

import { Combination, MasterWithRelationsEntity } from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';

import Avatar, { AvatarSize } from '@/_components/Avatar/Avatar';
import { CURRENCY } from '@/_constants/currency';
import { formatLocalizedCurrency, formatLocalizedDuration } from '@/_utils/intlFormatters';

type Props = {
  item: Combination;
  onClick?: () => void;
  isCard?: boolean;
  hideMasters?: boolean;
  master?: MasterWithRelationsEntity;
};

const wrapperStyles = tv({
  base: 'relative border border-gray-200 rounded-lg overflow-hidden w-full gap-4 py-4 pr-4 pl-6 relative before:content-[""] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-2 before:bg-primary-200',
  variants: {
    isCard: {
      true: '',
      false: 'cursor-pointer hover:bg-primary-100 focus:bg-primary-100 transition-colors',
    },
  },
});

export default function CombinationElement(props: Props) {
  const { item, onClick, isCard, hideMasters = false, master } = props;
  const locale = useLocale();

  const Wrapper = isCard ? 'div' : 'button';

  const price = useMemo(() => {
    return item.services.reduce((acc, service) => acc + service.price, 0);
  }, [item.services]);

  return (
    <Wrapper
      className={wrapperStyles({ isCard })}
      {...(!isCard && {
        type: 'button',
        onClick,
      })}
    >
      <div className='flex flex-col text-sm text-start gap-3 tracking-wider leading-none'>
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
                  {formatLocalizedDuration(service.durationMinutes, locale)}
                </span>
              </div>
              <span className='text-sm text-gray-600'>
                {formatLocalizedCurrency(service.price, CURRENCY, locale)}
              </span>
            </li>
          ))}
        </ul>
        <div className='flex items-center gap-4 justify-between'>
          <p className=' text-gray-600'>{formatLocalizedDuration(item.durationMinutes, locale)}</p>
          <p className='text-base'>{formatLocalizedCurrency(price, CURRENCY, locale)}</p>
        </div>
        {!isCard && item.masters && !hideMasters && (
          <ul className='flex flex-wrap gap-y-0.5 gap-x-1'>
            {item.masters.map((master) => (
              <li key={`service-master-${master.id}`} className='flex items-center gap-1'>
                <Avatar
                  name={master.name ?? ''}
                  size={AvatarSize.Small}
                  src={master.avatarPreviewUrl}
                  bgColor={colors.primary[200]}
                />
                <span className='text-gray-700 text-xs'>{master.name}</span>
              </li>
            ))}
          </ul>
        )}
        {isCard && master && !hideMasters && (
          <div className='flex items-center gap-1'>
            <Avatar
              name={master.name ?? ''}
              size={AvatarSize.Small}
              src={master.avatarPreviewUrl}
              bgColor={colors.primary[200]}
            />
            <span className='text-gray-700 text-xs'>{master.name}</span>
          </div>
        )}
      </div>
    </Wrapper>
  );
}
