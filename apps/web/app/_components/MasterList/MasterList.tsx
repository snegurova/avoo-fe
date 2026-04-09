'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';
import { SortDirection } from '@avoo/shared';

import { IconButton } from '@/_components/IconButton/IconButton';
import MasterListItem from '@/_components/MasterListItem/MasterListItem';
import ArrowDownIcon from '@/_icons/ArrowDownIcon';
import ArrowUpIcon from '@/_icons/ArrowUpIcon';

import InfiniteList from '../InfiniteList/InfiniteList';

type Props = {
  masters: MasterWithRelationsEntityResponse[] | null;
  onEdit?: (master: MasterWithRelationsEntityResponse) => void;
  selectedId?: number | null;
  incrementPage?: () => void;
  hasMore?: boolean;
  sortDirection?: SortDirection;
  onSortChange?: (direction: 'asc' | 'desc' | undefined) => void;
};

export const MasterList = ({
  masters,
  onEdit,
  selectedId,
  incrementPage,
  hasMore,
  sortDirection = null,
  onSortChange,
}: Props) => {
  const t = useTranslations('private.components.MasterList.MasterList');

  const isAscActive = sortDirection === 'asc';
  const isDescActive = sortDirection === 'desc';

  const handleAscSortClick = React.useCallback(() => {
    onSortChange?.(isAscActive ? undefined : 'asc');
  }, [isAscActive, onSortChange]);

  const handleDescSortClick = React.useCallback(() => {
    onSortChange?.(isDescActive ? undefined : 'desc');
  }, [isDescActive, onSortChange]);

  const uniqueList = React.useMemo(() => {
    const uniqueById = new Map<number, MasterWithRelationsEntityResponse>();
    for (const item of masters ?? []) {
      if (!uniqueById.has(item.id)) {
        uniqueById.set(item.id, item);
      }
    }

    return Array.from(uniqueById.values());
  }, [masters]);

  if (uniqueList.length === 0) {
    return <div className='py-8 text-center text-gray-500'>{t('noMastersYet')}</div>;
  }

  return (
    <div className='h-full min-h-0 flex flex-col'>
      <InfiniteList
        className='flex flex-col overflow-y-auto h-full min-h-0 max-h-full'
        hasMore={hasMore}
        onLoadMore={incrementPage}
      >
        <div className='hidden lg:flex sticky top-0 z-9 items-center gap-3 px-8 py-3 text-sm text-black font-semibold bg-primary-50'>
          <div className='w-1/5'>
            <div className='flex items-center gap-4 pl-2.5'>
              <span>{t('masterName')}</span>
              <div className='flex flex-col'>
                <IconButton
                  ariaLabel={t('sortAsc')}
                  onClick={handleAscSortClick}
                  className={`p-0 text-sm hover:text-gray-700 ${isAscActive ? 'text-gray-700' : 'text-gray-400'}`}
                  icon={<ArrowUpIcon width={14} height={14} />}
                />
                <IconButton
                  ariaLabel={t('sortDesc')}
                  onClick={handleDescSortClick}
                  className={`p-0 text-sm hover:text-gray-700 ${isDescActive ? 'text-gray-700' : 'text-gray-400'}`}
                  icon={<ArrowDownIcon width={14} height={14} />}
                />
              </div>
            </div>
          </div>
          <div className='w-1/5'>{t('mobileNumber')}</div>
          <div className='w-1/5'>{t('emailAddress')}</div>
          <div className='w-1/5'>{t('languages')}</div>
          <div className='w-12 text-right'>{t('actions')}</div>
        </div>

        <ul className='flex flex-col gap-4 lg:gap-0 mb-4'>
          {uniqueList.map((master) => (
            <li key={master.id}>
              <MasterListItem
                master={master}
                onEdit={onEdit}
                isSelected={master.id === selectedId}
              />
            </li>
          ))}
        </ul>
      </InfiniteList>
    </div>
  );
};

export default MasterList;
