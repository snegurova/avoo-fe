'use client';

import React from 'react';

import { Button, Typography } from '@mui/material';
import { tv } from 'tailwind-variants';

import SearchInput from '@/_components/SearchInput/SearchInput';
import SearchIcon from '@/_icons/SearchIcon';

export enum ControlsVariant {
  Default = 'default',
  StackedSearch = 'stackedSearch',
}

const controlsContainer = tv({
  variants: {
    variant: {
      [ControlsVariant.Default]: 'pt-4 pb-4 lg:p-4 flex flex-wrap items-center gap-y-3',
      [ControlsVariant.StackedSearch]: 'w-full flex flex-col gap-3 px-4 lg:p-4',
    },
  },
  defaultVariants: {
    variant: ControlsVariant.Default,
  },
});

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
  titleClassName?: string;
  variant?: ControlsVariant;
};

type UseMobileSearchInteractionsParams = {
  isSearchExpanded: boolean;
  setIsSearchExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  mobileSearchWrapperRef: React.RefObject<HTMLDivElement | null>;
  mobileSearchInputRef: React.RefObject<HTMLInputElement | null>;
};

function useMobileSearchInteractions({
  isSearchExpanded,
  setIsSearchExpanded,
  mobileSearchWrapperRef,
  mobileSearchInputRef,
}: UseMobileSearchInteractionsParams) {
  const handlePointerDownOutsideRef = React.useRef<
    ((event: MouseEvent | TouchEvent) => void) | null
  >(null);

  React.useEffect(() => {
    handlePointerDownOutsideRef.current = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node | null;
      if (!target) return;
      if (mobileSearchWrapperRef.current?.contains(target)) return;
      setIsSearchExpanded(false);
    };
  });

  React.useEffect(() => {
    if (!isSearchExpanded) return;

    mobileSearchInputRef.current?.focus();

    const handler = (event: MouseEvent | TouchEvent) =>
      handlePointerDownOutsideRef.current?.(event);

    document.addEventListener('mousedown', handler);
    document.addEventListener('touchstart', handler);

    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('touchstart', handler);
    };
  }, [isSearchExpanded, mobileSearchInputRef]);
}

function StackedSearchControls({
  title = '',
  placeholder = 'Search',
  searchValue = '',
  onSearchChange,
  onAddItem,
  showAddButton = true,
  addLabel = 'Add',
  className = '',
  searchClassName,
  titleClassName,
}: Readonly<Omit<Props, 'variant' | 'searchContainerClassName'>>) {
  const hasAddButton = showAddButton && Boolean(onAddItem);
  const [isSearchExpanded, setIsSearchExpanded] = React.useState(false);
  const mobileSearchWrapperRef = React.useRef<HTMLDivElement | null>(null);
  const mobileSearchInputRef = React.useRef<HTMLInputElement | null>(null);

  useMobileSearchInteractions({
    isSearchExpanded,
    setIsSearchExpanded,
    mobileSearchWrapperRef,
    mobileSearchInputRef,
  });

  const handleSearchChange = React.useCallback(
    (value: string) => {
      onSearchChange?.(value);
    },
    [onSearchChange],
  );

  const handleOpenMobileSearch = React.useCallback(() => {
    setIsSearchExpanded(true);
  }, []);

  return (
    <div className={controlsContainer({ variant: ControlsVariant.StackedSearch, className })}>
      <div className='flex items-center justify-between gap-3'>
        <div className='lg:hidden flex-1 flex items-center justify-between'>
          <Typography component='h1' variant='h1' className={`${titleClassName ?? ''}`}>
            {title}
          </Typography>

          <div className='hidden md:block'>
            {hasAddButton ? (
              <Button
                variant='outlined'
                color='primary'
                onClick={onAddItem}
                sx={(theme) => ({
                  minWidth: 'auto',
                  width: 'auto',
                  [theme.breakpoints.up('md')]: {
                    minWidth: 'auto',
                  },
                })}
              >
                {addLabel}
              </Button>
            ) : (
              <SearchInput
                value={searchValue}
                onChange={handleSearchChange}
                placeholder={placeholder}
                className={searchClassName ?? 'w-[306px]'}
              />
            )}
          </div>

          <div className='md:hidden'>
            {isSearchExpanded === false ? (
              <Button
                onClick={handleOpenMobileSearch}
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
              onChange={handleSearchChange}
              placeholder={placeholder}
              className={searchClassName ?? 'lg:w-[306px]'}
            />
          </div>

          <div className='flex-shrink-0'>
            {showAddButton && onAddItem ? (
              <Button
                variant='outlined'
                color='primary'
                onClick={onAddItem}
                sx={(theme) => ({
                  minWidth: 'auto',
                  width: 'auto',
                  [theme.breakpoints.up('md')]: {
                    minWidth: 'auto',
                  },
                })}
              >
                {addLabel}
              </Button>
            ) : null}
          </div>
        </div>
      </div>

      {hasAddButton ? (
        <div className='hidden md:block lg:hidden w-full'>
          <SearchInput
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={placeholder}
            className={searchClassName ?? 'w-full'}
          />
        </div>
      ) : null}

      <div
        ref={mobileSearchWrapperRef}
        className={`md:hidden w-full overflow-hidden transition-all duration-200 ease-out ${isSearchExpanded ? 'max-h-20 opacity-100 mt-1' : 'max-h-0 opacity-0 pointer-events-none'}`}
      >
        <div className='w-full flex items-center gap-2'>
          <div className='flex-1'>
            <SearchInput
              value={searchValue}
              onChange={handleSearchChange}
              placeholder={placeholder}
              className='w-full'
              inputRef={mobileSearchInputRef}
            />
          </div>
        </div>
      </div>

      <div className='md:hidden w-full'>
        {hasAddButton ? (
          <Button variant='outlined' color='primary' fullWidth onClick={onAddItem}>
            {addLabel}
          </Button>
        ) : null}
      </div>
    </div>
  );
}

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
  titleClassName,
  variant = ControlsVariant.Default,
}: Readonly<Props>) {
  const handleSearchChange = React.useCallback(
    (value: string) => {
      onSearchChange?.(value);
    },
    [onSearchChange],
  );

  if (variant === ControlsVariant.StackedSearch) {
    return (
      <StackedSearchControls
        title={title}
        placeholder={placeholder}
        searchValue={searchValue}
        onSearchChange={handleSearchChange}
        onAddItem={onAddItem}
        showAddButton={showAddButton}
        addLabel={addLabel}
        className={className}
        searchClassName={searchClassName}
        titleClassName={titleClassName}
      />
    );
  }

  return (
    <div className={controlsContainer({ variant: ControlsVariant.Default, className })}>
      <div className='flex flex-wrap md:flex-nowrap w-full items-center gap-y-4 gap-8'>
        <Typography component='h1' variant='h1' className={`order-1 ${titleClassName ?? ''}`}>
          {title}
        </Typography>

        <div className='order-2 md:order-3 ml-auto md:ml-0'>
          {showAddButton && onAddItem ? (
            <Button
              variant='outlined'
              color='primary'
              onClick={onAddItem}
              sx={(theme) => ({
                minWidth: 'auto',
                width: 'auto',
                [theme.breakpoints.up('md')]: {
                  minWidth: 'auto',
                },
              })}
            >
              {addLabel}
            </Button>
          ) : null}
        </div>

        <div className='order-3 md:order-2 w-full md:w-auto md:ml-auto'>
          <SearchInput
            value={searchValue}
            onChange={handleSearchChange}
            placeholder={placeholder}
            className={searchClassName ?? 'md:w-[306px] lg:w-[306px]'}
          />
        </div>
      </div>
    </div>
  );
}
