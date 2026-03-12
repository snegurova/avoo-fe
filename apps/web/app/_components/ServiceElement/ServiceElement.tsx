import React from 'react';

import { tv } from 'tailwind-variants';

import { MasterWithRelationsEntity, Service } from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';
import { currencyUtils, timeUtils } from '@avoo/shared';

import Avatar, { AvatarSize } from '@/_components/Avatar/Avatar';
import { CURRENCY } from '@/_constants/currency';

type Props = {
  item: Service;
  onClick?: () => void;
  isCard?: boolean;
  hideMasters?: boolean;
  master?: MasterWithRelationsEntity;
};

const wrapperStyles = tv({
  base: 'relative border border-gray-200 rounded-lg overflow-hidden w-full flex items-center justify-between gap-4 py-4 pr-4 pl-6 relative before:content-[""] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-2 before:bg-primary-200',
  variants: {
    isButton: {
      true: 'cursor-pointer hover:bg-primary-100 focus:bg-primary-100 transition-colors',
      false: '',
    },
  },
});

export default function ServiceElement(props: Props) {
  const { item, onClick, isCard, hideMasters = false, master } = props;

  const isButton = Boolean(onClick);

  const Wrapper = isButton ? 'button' : 'div';

  return (
    <Wrapper
      className={wrapperStyles({ isButton })}
      {...(isButton && {
        type: 'button',
        onClick,
      })}
    >
      <div className='flex flex-col text-sm text-start gap-2 tracking-wider leading-none'>
        <h3 className='font-medium text-black'>{item.name}</h3>
        <p className=' text-gray-600'>{timeUtils.convertDuration(item.durationMinutes)}</p>
        {!isCard && item.masters && !hideMasters && (
          <ul className='flex flex-wrap gap-y-0.5 gap-x-1'>
            {item.masters.map((master) => (
              <li key={`service-master-${master.id}`} className='flex items-center gap-1'>
                <Avatar
                  name={master.name ?? ''}
                  size={AvatarSize.Small}
                  src={master.avatarUrl ?? undefined}
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
              src={master.avatarUrl ?? undefined}
              bgColor={colors.primary[200]}
            />
            <span className='text-gray-700 text-xs'>{master.name}</span>
          </div>
        )}
      </div>
      <div className=''>{currencyUtils.formatPrice(item.price, CURRENCY)}</div>
    </Wrapper>
  );
}
