import React from 'react';
import { useLocale } from 'next-intl';

import { tv } from 'tailwind-variants';

import AddIcon from '@/_icons/AddIcon';
import RemoveIcon from '@/_icons/RemoveIcon';
import { formatLocalizedDuration } from '@/_utils/intlFormatters';

const buttonStyles = tv({
  base: 'w-8.5 h-8.5 flex items-center justify-center border border-gray-200 hover:bg-gray-100 focus:bg-gray-100 transition-colors cursor-pointer',
  variants: {
    type: {
      left: 'rounded-l-full',
      right: 'rounded-r-full',
    },
  },
});

type Props = {
  value: number | undefined;
  onDecrease: () => void;
  onIncrease: () => void;
};

export default function FormCounter(props: Props) {
  const { value, onDecrease, onIncrease } = props;
  const locale = useLocale();

  return (
    <div className='flex'>
      <button type='button' onClick={onDecrease} className={buttonStyles({ type: 'left' })}>
        <RemoveIcon className='w-3.5 h-3.5' />
      </button>
      <span className='h-8.5 flex items-center justify-center border-t border-b border-gray-200 w-30 text-sm tracking-wider'>
        {value ? formatLocalizedDuration(value, locale) : ''}
      </span>
      <button type='button' onClick={onIncrease} className={buttonStyles({ type: 'right' })}>
        <AddIcon className='w-3.5 h-3.5' />
      </button>
    </div>
  );
}
