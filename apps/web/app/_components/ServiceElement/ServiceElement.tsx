import React from 'react';

import { tv } from 'tailwind-variants';

import { MasterWithRelationsEntity, Service } from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';
import { currencyUtils, timeUtils } from '@avoo/shared';

import Avatar, { AvatarSize } from '@/_components/Avatar/Avatar';
import { CURRENCY } from '@/_constants/currency';
import CloseIcon from '@/_icons/CloseIcon';

type Props = {
  item: Service;
  onClick?: () => void;
  onDelete?: () => void;
  isCard?: boolean;
  isDurationChanged?: boolean;
  hideMasters?: boolean;
  master?: MasterWithRelationsEntity;
};

const wrapperStyles = tv({
  base: 'relative border border-gray-200 rounded-lg w-full flex items-center justify-between gap-4 py-4 pr-4 pl-6 before:content-[""] before:absolute before:left-0 before:top-0 before:bottom-0 before:w-2 before:bg-primary-200 before:rounded-l-lg',
  variants: {
    isButton: {
      true: 'cursor-pointer hover:bg-primary-100 focus:bg-primary-100 transition-colors',
      false: '',
    },
  },
});

const durationStyles = tv({
  base: 'text-gray-600',
  variants: {
    isDurationChanged: {
      true: 'text-gray-500 line-through text-xs',
      false: '',
    },
  },
});

export default function ServiceElement(props: Props) {
  const {
    item,
    onClick,
    onDelete,
    isCard,
    hideMasters = false,
    master,
    isDurationChanged = false,
  } = props;

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
        <p className={durationStyles({ isDurationChanged })}>
          {timeUtils.convertDuration(item.durationMinutes)}
        </p>
        {!isCard && item.masters && !hideMasters && (
          <ul className='flex flex-wrap gap-y-0.5 gap-x-1'>
            {item.masters.map((master) => (
              <li key={`service-master-${master.id}`} className='flex items-center gap-1'>
                <Avatar name={master.name} size={AvatarSize.Small} src={master.avatarPreviewUrl} />
                <span className='text-gray-700 text-xs'>{master.name}</span>
              </li>
            ))}
          </ul>
        )}
        {isCard && master && !hideMasters && (
          <div className='flex items-center gap-1'>
            <Avatar name={master.name} size={AvatarSize.Small} src={master.avatarPreviewUrl} />
            <span className='text-gray-700 text-xs'>{master.name}</span>
          </div>
        )}
      </div>
      <div className=''>{currencyUtils.formatPrice(item.price, CURRENCY)}</div>
      {onDelete && (
        <button
          onClick={() => onDelete()}
          className='absolute bg-white absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 border-1 border-gray-100 w-6 h-6 text-black rounded-full flex items-center justify-center duration-200 z-1 cursor-pointer'
          type='button'
        >
          <CloseIcon fill={colors.black} width={20} height={20} />
        </button>
      )}
    </Wrapper>
  );
}
