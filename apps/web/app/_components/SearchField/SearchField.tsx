import React, { useState } from 'react';
import { IconButton } from '@/_components/IconButton/IconButton';
import SearchIcon from '@/_icons/SearchIcon';
import { SearchInput } from '@/_components/SearchInput/SearchInput';
import { ClickAwayListener } from '@mui/material';
import AddIcon from '@/_icons/AddIcon';

type Props<R extends { id?: number }, T extends { id: number }> = {
  label: string;
  value: R | { id: number } | null;
  searchMode: boolean;
  onChange: (value: R | { id: number }) => void;
  items: T[];
  search: string;
  setSearch: (value: string) => void;
  ItemElement: React.ComponentType<{ item: T; onClick: () => void }>;
  onAddClick?: () => void;
  placeholder?: string;
  className?: string;
  error?: string;
};

export default function SearchField<R extends { id?: number }, T extends { id: number }>(
  props: Props<R, T>,
) {
  const {
    label,
    value,
    onChange,
    items,
    search,
    setSearch,
    ItemElement,
    onAddClick,
    searchMode = true,
    placeholder = 'Search by name, email, phone',
    className = '',
    error,
  } = props;
  const [isActive, setIsActive] = useState(false);

  const onSearchBtnClick = () => {
    setIsActive(true);
  };

  const onSearchFocus = () => {
    setIsActive(true);
  };

  const onItemClick = (id: number) => {
    onChange({ id });
    setIsActive(false);
  };

  const onClickAway = () => {
    setIsActive(false);
  };

  const onAddClickHandler = () => {
    if (onAddClick) {
      onAddClick();
    }
    setIsActive(false);
  };

  return (
    <ClickAwayListener onClickAway={onClickAway}>
      <div className={`${!searchMode ? 'mb-3' : ''} ${className}`}>
        <div className='flex items-center justify-between gap-2 mb-2'>
          <h3 className='font-medium'>{label}</h3>
          {!isActive && !searchMode && (
            <IconButton icon={<SearchIcon />} onClick={onSearchBtnClick} />
          )}
        </div>
        <div className='relative'>
          {(searchMode || isActive) && (
            <SearchInput
              value={search}
              onChange={setSearch}
              borderRadius={8}
              placeholder={placeholder}
              onFocus={onSearchFocus}
              error={error}
            />
          )}
          {isActive && (
            <div className='z-2 absolute left-0 right-0 top-[calc(100%+4px)] flex flex-col p-4 bg-white rounded-lg border-gray-200 border'>
              {onAddClick && (searchMode || Object.prototype.hasOwnProperty.call(value, 'id')) && (
                <div className='mb-4 pb-4 border-b-2 border-primary-100'>
                  <button
                    type='button'
                    onClick={onAddClickHandler}
                    className='flex gap-5 items-center font-medium text-sm group cursor-pointer w-full rounded-lg p-2 hover:bg-primary-100 focus:bg-primary-100 transition-colors group'
                  >
                    <div className='shrink-0 rounded-full w-10 h-10 bg-primary-100 group-hover:bg-primary-200 group-focus:bg-primary-200 flex items-center justify-center transition-colors'>
                      <AddIcon />
                    </div>
                    <span>Add new {label.toLowerCase()}</span>
                  </button>
                </div>
              )}
              <ul className='flex flex-col gap-2 max-h-80 overflow-y-auto'>
                {items.length > 0 &&
                  items.map((item, index) => (
                    <li key={label + index}>
                      <ItemElement item={item} onClick={() => onItemClick(item.id)} />
                    </li>
                  ))}
                {items.length === 0 && (
                  <li className='text-gray-500'>No {label.toLowerCase()}s found</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </ClickAwayListener>
  );
}
