import React, { useState } from 'react';
import { IconButton } from '@/_components/IconButton/IconButton';
import SearchIcon from '@/_icons/SearchIcon';
import { SearchInput } from '@/_components/SearchInput/SearchInput';
import { isEmptyObject } from '@avoo/shared';

type Props<R extends { id?: number }, T extends { id: number }> = {
  label: string;
  value: R | { id: number } | undefined;
  onChange: (value: R | { id: number }) => void;
  items: T[];
  search: string;
  setSearch: (value: string) => void;
  ItemElement: React.ComponentType<{ item: T; onClick: () => void }>;
};

export default function SearchField<R extends { id?: number }, T extends { id: number }>(
  props: Props<R, T>,
) {
  const { label, value, onChange, items, search, setSearch, ItemElement } = props;
  const [isActive, setIsActive] = useState(true);

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

  return (
    <div className=''>
      <div className='flex items-center justify-between gap-2 mb-2'>
        <h3 className='font-medium py-1'>{label}</h3>
        {(!isActive || !isEmptyObject(value)) && (
          <IconButton icon={<SearchIcon />} onClick={onSearchBtnClick} />
        )}
      </div>
      <div className=''>
        {(isEmptyObject(value) || isActive) && (
          <SearchInput
            value={search}
            onChange={setSearch}
            borderRadius={8}
            placeholder='Search by name, email ...'
            onFocus={onSearchFocus}
          />
        )}
        {isActive && (
          <div>
            <ul>
              {items.map((item, index) => (
                <li key={label + index}>
                  <ItemElement item={item} onClick={() => onItemClick(item.id)} />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
