'use client';

import React from 'react';
import { Button, Typography } from '@mui/material';
import SearchInput from '@/_components/SearchInput/SearchInput';

type Props = {
  title?: string;
  placeholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onAddItem?: () => void;
  showAddButton?: boolean;
  addLabel?: string;
  className?: string;
};

export default function Controls({
  title = '',
  placeholder = 'Search',
  searchValue = '',
  onSearchChange,
  onAddItem,
  showAddButton = true,
  addLabel = 'Add',
  className = '',
}: Props) {
  return (
    <div className={`p-4 flex flex-wrap items-center gap-y-3 ${className}`}>
      <div className='flex flex-wrap md:flex-nowrap w-full items-center gap-y-4 gap-x-2'>
        <Typography component='h1' variant='h1' className='order-1'>
          {title}
        </Typography>

        <div className='order-2 md:order-3 ml-auto md:ml-0'>
          {showAddButton && onAddItem ? (
            <Button
              variant='outlined'
              onClick={onAddItem}
              sx={(theme) => ({
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
                '&:hover': { backgroundColor: theme.palette.primary.light },
              })}
            >
              {addLabel}
            </Button>
          ) : null}
        </div>

        <div className='order-3 md:order-2 w-full md:w-auto md:ml-auto'>
          <SearchInput
            value={searchValue}
            onChange={(v) => onSearchChange?.(v)}
            placeholder={placeholder}
            className={'md:w-[306px] lg:w-[306px] md:mr-8 lg:mr-12'}
          />
        </div>
      </div>
    </div>
  );
}
