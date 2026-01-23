'use client';

import React from 'react';
import SearchIcon from '@/_icons/SearchIcon';
import { colors, typography } from '@avoo/design-tokens';
import { useTheme, Theme } from '@mui/material/styles';

type Props = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
};

export const SearchInput = ({ value, onChange, placeholder = 'Search', className }: Props) => {
  const theme = useTheme() as Theme;
  const mix = theme.mixins?.searchInput ?? {
    height: 44,
    borderRadius: 18,
    iconSize: 20,
    iconMarginLeft: 12,
  };

  return (
    <div className={`${className ?? 'w-full'}`}>
      <div
        className='flex items-center border border-gray-200 pr-3 gap-2 focus-within:[border-color:var(--color-primary-700)]'
        style={{
          backgroundColor: theme.palette?.background?.paper ?? colors.white,
          borderRadius: mix.borderRadius,
          height: `${mix.height}px`,
          minHeight: `${mix.height}px`,
          paddingLeft: 0,
        }}
      >
        <SearchIcon
          width={mix.iconSize}
          height={mix.iconSize}
          className='text-gray-400'
          style={{ marginLeft: mix.iconMarginLeft, fill: theme.palette.text.secondary }}
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={'outline-none text-sm text-gray-700 truncate'}
          style={{
            fontSize: typography.fontSize.md,
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            width: '100%',
            maxWidth: '100%',
            boxSizing: 'border-box',
          }}
        />
      </div>
    </div>
  );
};

export default SearchInput;
