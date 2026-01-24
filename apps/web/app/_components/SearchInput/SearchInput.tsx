'use client';

import React from 'react';
import SearchIcon from '@/_icons/SearchIcon';
import { colors, typography } from '@avoo/design-tokens';
import { useTheme, Theme } from '@mui/material/styles';

type Props = {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  placeholder?: string;
  className?: string;
  borderRadius?: number;
};

export const SearchInput = ({
  value,
  onChange,
  onFocus = () => {},
  placeholder = 'Search',
  className,
  borderRadius,
}: Props) => {
  const theme = useTheme() as Theme;
  const mix = theme.mixins?.searchInput ?? {
    height: 44,
    borderRadius: 18,
    iconSize: 24,
    iconMarginLeft: 12,
  };

  return (
    <div className={`w-full ${className ?? ''}`}>
      <div
        className='flex items-center border border-gray-200 pr-3 gap-2 focus-within:[border-color:var(--color-primary-700)]'
        style={{
          backgroundColor: theme.palette?.background?.paper ?? colors.white,
          borderRadius: borderRadius ?? mix.borderRadius,
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
          className='flex-1 outline-none text-sm text-gray-700'
          style={{ fontSize: typography.fontSize.md }}
          onFocus={onFocus}
        />
      </div>
    </div>
  );
};

export default SearchInput;
