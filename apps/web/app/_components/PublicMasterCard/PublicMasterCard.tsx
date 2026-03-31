import React from 'react';
import { useTranslations } from 'next-intl';

import { tv } from 'tailwind-variants';

import { MasterWithRelationsEntity } from '@avoo/axios/types/apiTypes';

import GroupIcon from '@/_icons/GroupIcon';
import LanguageIcon from '@/_icons/LanguageIcon';

type Props = {
  master?: MasterWithRelationsEntity;
  onClick?: () => void;
  isSelected?: boolean;
  type?: 'change' | 'select';
  onClear?: () => void;
};

const card = tv({
  base: 'flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-6 rounded-lg border transition-colors',
  variants: {
    selected: {
      true: 'border-black',
      false: 'border-gray-200',
    },
  },
});

const avatar = tv({
  base: 'rounded-full w-15 h-15 ',
  variants: {
    withMaster: {
      true: 'bg-gray-100',
      false: 'bg-white border border-black flex items-center justify-center',
    },
  },
});

const button = tv({
  base: 'cursor-pointer transition-colors',
  variants: {
    type: {
      select:
        'font-semibold bg-black rounded-lg py-3.5 px-5 justify-center text-white border-black hover:bg-white focus:bg-white hover:text-black focus:text-black border leading-none',
      change:
        'text-gray-600 font-medium text-sm leading-base hover:text-black focus:text-black underline',
    },
  },
});

export default function PublicMasterCard(props: Props) {
  const { master, onClick, isSelected, type = 'select', onClear } = props;
  const t = useTranslations('public.salon.createOrder');

  const isClickable = Boolean(onClick);

  return (
    <div className={card({ selected: isSelected })}>
      <div className='flex items-center gap-3'>
        <div className={avatar({ withMaster: Boolean(master) })}>
          {master?.avatarPreviewUrl && (
            <img
              src={master.avatarPreviewUrl}
              alt={master.name}
              className='rounded-full w-full h-full object-cover'
            />
          )}
          {!master && <GroupIcon className='w-11 h-11 fill-black' />}
        </div>
        <div className='flex flex-col items-start gap-2'>
          <p className='text-gray-700 font-medium'>{master?.name ?? t('anyMaster')}</p>
          {master?.languages && (
            <div className='flex items-center justify-center gap-1 text-gray-600'>
              <LanguageIcon className='w-6 h-6 fill-current' />
              <p className='text-xs leading-tight font-medium'>
                {master.languages.join(', ').toUpperCase()}
              </p>
            </div>
          )}
          {!master && (
            <p className='text-xs leading-tight text-gray-600'>{t('anyMasterHeadline')}</p>
          )}
        </div>
      </div>
      {isClickable && !isSelected && (
        <div className='flex items-center gap-4 self-end md:self-auto'>
          {type === 'change' && (
            <button type='button' onClick={onClear} className={button({ type })}>
              {t('clear')}
            </button>
          )}
          <button type='button' onClick={onClick} className={button({ type })}>
            {type === 'select' ? t('select') : t('change')}
          </button>
        </div>
      )}
      {isClickable && isSelected && (
        <button
          type='button'
          onClick={onClick}
          className='font-semibold bg-white rounded-lg py-3.5 px-5 justify-center text-black border-black border leading-none cursor-pointer transition-colors hover:bg-gray-100 focus:bg-gray-100 self-end md:self-auto'
        >
          {t('selected')}
        </button>
      )}
    </div>
  );
}
