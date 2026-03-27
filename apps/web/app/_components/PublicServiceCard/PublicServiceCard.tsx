import React from 'react';
import { useTranslations } from 'next-intl';

import { tv } from 'tailwind-variants';

import { Service } from '@avoo/axios/types/apiTypes';

import ScheduleIcon from '@/_icons/ScheduleIcon';

type Props = {
  service: Service;
  onClick?: () => void;
  isSelected?: boolean;
  type?: 'change' | 'select';
  onClear?: () => void;
  onCardClick?: () => void;
};

const card = tv({
  base: 'p-6 border rounded-lg flex flex-col gap-5 transition-colors text-start',
  variants: {
    selected: {
      true: 'border-black',
      false: 'border-gray-200',
    },
    isButton: {
      true: 'cursor-pointer hover:bg-gray-100 focus:bg-gray-100',
      false: '',
    },
  },
});

export default function PublicServiceCard(props: Props) {
  const { service, onClick, isSelected, type = 'select', onClear, onCardClick } = props;
  const t = useTranslations('public.salon.createOrder');

  const isClickable = Boolean(onClick);

  const isButton = Boolean(onCardClick);

  const Wrapper = isButton ? 'button' : 'div';

  return (
    <Wrapper
      className={card({ selected: isSelected, isButton })}
      {...(isButton && {
        type: 'button',
        onClick: onCardClick,
      })}
    >
      {service.medias && service.medias.length > 0 && (
        <div className='flex gap-2'>
          {service.medias.slice(0, 4).map((media) => (
            <div className='rounded-sm overflow-hidden w-11 h-11' key={media.id}>
              <img
                key={media.id}
                src={media.url}
                alt={service.name}
                className='w-full h-full object-cover object-center'
              />
            </div>
          ))}
          {service.medias.length > 4 && (
            <div className='rounded-sm overflow-hidden w-11 h-11 flex items-center justify-center text-gray-500 text-sm border border-gray-500'>
              +{service.medias.length - 4}
            </div>
          )}
        </div>
      )}
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
        {isClickable && !isSelected && (
          <div className='flex items-center gap-4'>
            {type === 'change' && (
              <button
                type='button'
                onClick={onClear}
                className='font-semibold bg-white rounded-lg py-3.5 px-5 justify-center text-black border-black border leading-none cursor-pointer transition-colors hover:bg-gray-100 focus:bg-gray-100'
              >
                {t('clear')}
              </button>
            )}
            <button
              type='button'
              onClick={onClick}
              className='font-semibold bg-black rounded-lg py-3.5 px-5 justify-center text-white border-black transition-colors hover:bg-white focus:bg-white hover:text-black focus:text-black border cursor-pointer leading-none'
            >
              {type === 'select' ? t('select') : t('change')}
            </button>
          </div>
        )}

        {isClickable && isSelected && (
          <button
            type='button'
            onClick={onClick}
            className='font-semibold bg-white rounded-lg py-3.5 px-5 justify-center text-black border-black border leading-none cursor-pointer transition-colors hover:bg-gray-100 focus:bg-gray-100'
          >
            {t('selected')}
          </button>
        )}
      </div>
    </Wrapper>
  );
}
