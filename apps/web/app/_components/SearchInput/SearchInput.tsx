'use client';

import React from 'react';
import SearchIcon from '@/_icons/SearchIcon';
import { colors, typography } from '@avoo/design-tokens';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export const SearchInput = ({ value, onChange, placeholder = 'Search', className }: Props) => {
  return (
    <div className={`w-full ${className ?? ''}`}>
      <div
        className='flex items-center border rounded-full px-3 py-2 gap-2'
        style={{ borderColor: colors.gray[200], backgroundColor: colors.white }}
      >
        <SearchIcon width={20} height={20} className='text-gray-400' />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className='flex-1 outline-none text-sm text-gray-700'
          style={{ fontSize: typography.fontSize.md }}
        />
      </div>
    </div>
  );
};

export default SearchInput;
