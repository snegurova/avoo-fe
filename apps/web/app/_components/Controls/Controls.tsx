'use client';

import React from 'react';
import { Button, Typography } from '@mui/material';
import SearchInput from '@/_components/SearchInput/SearchInput';
import SearchIcon from '@/_icons/SearchIcon';

export enum ControlsVariant {
  Default = 'default',
  StackedSearch = 'stackedSearch',
}

type Props = {
  title?: string;
  placeholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onAddItem?: () => void;
  showAddButton?: boolean;
  addLabel?: string;
  className?: string;
  searchClassName?: string;
  searchContainerClassName?: string;
  titleClassName?: string;
  variant?: ControlsVariant;
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
  searchClassName,
  searchContainerClassName,
  titleClassName,
  variant = ControlsVariant.Default,
}: Props) {
  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);
  if (variant === ControlsVariant.StackedSearch) {
    return (
      <div className={`w-full flex flex-col gap-3 pt-8 pb-8 lg:p-4 ${className}`}>
        <div className='flex items-center justify-between gap-3'>
          <div className='lg:hidden flex-1 flex items-center justify-between'>
            <Typography component='h1' variant='h1' className={`${titleClassName ?? ''}`}>
              {title}
            </Typography>

            <div className='hidden md:block'>
              {showAddButton && onAddItem ? (
                <Button
                  variant='outlined'
                  onClick={onAddItem}
                  sx={(theme) => ({
                    minWidth: 'auto',
                    width: 'auto',
                    [theme.breakpoints.up('md')]: {
                      minWidth: 'auto',
                    },
                    color: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main,
                    '&:hover': { backgroundColor: theme.palette.primary.light },
                  })}
                >
                  {addLabel}
                </Button>
              ) : null}
            </div>

            <div className='md:hidden'>
              {isSearchExpanded === false ? (
                <Button
                  onClick={() => setIsSearchExpanded(true)}
                  variant='outlined'
                  sx={(theme) => ({
                    width: 44,
                    height: 44,
                    minWidth: 44,
                    padding: 0,
                    borderRadius: '18px',
                    borderColor: theme.palette.grey[200],
                    color: theme.palette.text.secondary,
                    boxShadow: 'none',
                  })}
                >
                  <SearchIcon />
                </Button>
              ) : null}
            </div>
          </div>

          <div className='hidden lg:flex items-center justify-center w-full gap-10'>
            <Typography component='h1' variant='h1' className={`${titleClassName ?? ''}`}>
              {title}
            </Typography>

            <div className='flex-1' />

            <div className='flex-shrink-0'>
              <SearchInput
                value={searchValue}
                onChange={(v) => onSearchChange?.(v)}
                placeholder={placeholder}
                className={searchClassName ?? 'lg:w-[306px]'}
              />
            </div>

            <div className='flex-shrink-0'>
              {showAddButton && onAddItem ? (
                <Button
                  variant='outlined'
                  onClick={onAddItem}
                  sx={(theme) => ({
                    minWidth: 'auto',
                    width: 'auto',
                    [theme.breakpoints.up('md')]: {
                      minWidth: 'auto',
                    },
                    color: theme.palette.primary.main,
                    borderColor: theme.palette.primary.main,
                    '&:hover': { backgroundColor: theme.palette.primary.light },
                  })}
                >
                  {addLabel}
                </Button>
              ) : null}
            </div>
          </div>
        </div>

        <div className='hidden md:block lg:hidden w-full'>
          <SearchInput
            value={searchValue}
            onChange={(v) => onSearchChange?.(v)}
            placeholder={placeholder}
            className={searchClassName ?? 'w-full'}
          />
        </div>

        {isSearchExpanded && (
          <div className='md:hidden w-full flex items-center gap-2'>
            <div className='flex-1'>
              <SearchInput
                value={searchValue}
                onChange={(v) => onSearchChange?.(v)}
                placeholder={placeholder}
                className='w-full'
              />
            </div>
          </div>
        )}

        <div className='md:hidden w-full'>
          {showAddButton && onAddItem ? (
            <Button
              variant='outlined'
              fullWidth
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
      </div>
    );
  }

  return (
    <div className={`pt-4 pb-4 lg:p-4 flex flex-wrap items-center gap-y-3 ${className}`}>
      <div className='flex flex-wrap md:flex-nowrap w-full items-center gap-y-4 gap-8'>
        <Typography component='h1' variant='h1' className={`order-1 ${titleClassName ?? ''}`}>
          {title}
        </Typography>

        <div className='order-2 md:order-3 ml-auto md:ml-0'>
          {showAddButton && onAddItem ? (
            <Button
              variant='outlined'
              onClick={onAddItem}
              sx={(theme) => ({
                minWidth: 'auto',
                width: 'auto',
                [theme.breakpoints.up('md')]: {
                  minWidth: 'auto',
                },
                color: theme.palette.primary.main,
                borderColor: theme.palette.primary.main,
                '&:hover': { backgroundColor: theme.palette.primary.light },
              })}
            >
              {addLabel}
            </Button>
          ) : null}
        </div>

        <div
          className={searchContainerClassName ?? 'order-3 md:order-2 w-full md:w-auto md:ml-auto'}
        >
          <SearchInput
            value={searchValue}
            onChange={(v) => onSearchChange?.(v)}
            placeholder={placeholder}
            className={searchClassName ?? 'md:w-[306px] lg:w-[306px]'}
          />
        </div>
      </div>
    </div>
  );
}
