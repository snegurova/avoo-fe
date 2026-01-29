'use client';

import React from 'react';
import { Control, FieldValues, Path } from 'react-hook-form';
import { type LanguageCode } from '@avoo/constants';
import SearchInput from '@/_components/SearchInput/SearchInput';
import LanguageDropdownItem from './LanguageDropdownItem';
import LanguageChip from './LanguageChip';
import { useLanguagePicker } from '@avoo/hooks';

type Props<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  placeholder?: string;
  error?: string;
  className?: string;
};

export default function FormLanguageSearch<T extends FieldValues>(props: Readonly<Props<T>>) {
  const { name, control, placeholder = 'Search language', error, className } = props;

  const { selected, query, setQuery, filtered, add, remove } = useLanguagePicker(control, name);

  return (
    <div className={`relative ${className ?? ''}`}>
      <div className='mt-6 mb-6 lg:flex lg:items-start lg:gap-6'>
        <div className='relative w-full lg:w-1/2'>
          <SearchInput
            value={query}
            onChange={setQuery}
            placeholder={placeholder}
            className='w-full'
          />

          {query && filtered.length > 0 && (
            <div className='absolute left-0 right-0 mt-1 bg-white border border-gray-200 rounded-md shadow-sm z-10'>
              {filtered.map((code) => (
                <LanguageDropdownItem key={code} code={code} onSelect={add} />
              ))}
            </div>
          )}
        </div>

        <div className='mt-4 lg:mt-0 lg:w-1/2 flex flex-wrap gap-3'>
          {selected.map((code: LanguageCode) => (
            <LanguageChip key={code} code={code} onRemove={remove} />
          ))}
        </div>
      </div>

      {error && <div className='mt-1 text-sm text-red-500'>{error}</div>}
    </div>
  );
}
