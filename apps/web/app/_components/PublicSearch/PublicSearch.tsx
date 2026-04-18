import React from 'react';
import { useTranslations } from 'next-intl';

import SearchIcon from '@/_icons/SearchIcon';

type Props = {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
};

export default function PublicSearch(props: Props) {
  const { placeholder, value, onChange } = props;
  const t = useTranslations('public.salon.createOrder');

  return (
    <div className='relative translate-x-4 md:translate-x-0 '>
      <input
        name='service-search'
        type='text'
        placeholder={t(placeholder)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='pl-11 pr-4 py-2 rounded-full border transition-colors text-sm leading-none text-black border-gray-600 hover:border-black focus:border-black w-full outline-0 min-w-55 placeholder:text-gray-600'
      />
      <SearchIcon className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-600' />
    </div>
  );
}
