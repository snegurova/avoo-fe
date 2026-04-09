'use client';

import React, { useMemo } from 'react';
import { useTranslations } from 'next-intl';

import type { CustomerInfoResponse, GetCustomersResponse } from '@avoo/axios/types/apiTypes';
import { SortDirection } from '@avoo/shared';

import ClientListItem from '@/_components/ClientListItem/ClientListItem';
import { IconButton } from '@/_components/IconButton/IconButton';
import ArrowDownIcon from '@/_icons/ArrowDownIcon';
import ArrowUpIcon from '@/_icons/ArrowUpIcon';

import InfiniteList from '../InfiniteList/InfiniteList';

type Props = {
  onEdit: (client: CustomerInfoResponse) => void;
  customers?: CustomerInfoResponse[] | GetCustomersResponse | null;
  selectedId?: number | null;
  incrementPage?: () => void;
  hasMore?: boolean;
  sortDirection?: SortDirection;
  onSortChange?: (direction: 'asc' | 'desc' | undefined) => void;
};

export const ClientsList: React.FC<Props> = ({
  onEdit,
  customers: customersProp,
  selectedId,
  incrementPage,
  hasMore,
  sortDirection = null,
  onSortChange,
}) => {
  const t = useTranslations('private.components.ClientsList.ClientsList');
  const customersSource = customersProp;
  const items: CustomerInfoResponse[] = Array.isArray(customersSource)
    ? customersSource
    : (customersSource?.items ?? []);

  const isAscActive = sortDirection === 'asc';
  const isDescActive = sortDirection === 'desc';
  const handleAscSortClick = React.useCallback(() => {
    onSortChange?.(isAscActive ? undefined : 'asc');
  }, [isAscActive, onSortChange]);
  const handleDescSortClick = React.useCallback(() => {
    onSortChange?.(isDescActive ? undefined : 'desc');
  }, [isDescActive, onSortChange]);

  const uniqueList = useMemo(() => {
    const uniqueById = new Map<number, CustomerInfoResponse>();
    for (const item of items ?? []) {
      if (!uniqueById.has(item.id)) {
        uniqueById.set(item.id, item);
      }
    }

    return Array.from(uniqueById.values());
  }, [items]);

  if (!items || items.length === 0) {
    return <div className='py-8 text-center text-gray-500'>{t('noClientsYet')}</div>;
  }

  return (
    <div className='h-full min-h-0 flex flex-col'>
      <InfiniteList
        className='flex flex-col overflow-y-auto h-full min-h-0 max-h-full'
        hasMore={hasMore}
        onLoadMore={incrementPage}
      >
        <div className='hidden lg:flex sticky top-0 z-9 items-center gap-3 px-8 py-3 text-sm text-black font-semibold bg-primary-50'>
          <div className='w-1/4'>
            <div className='flex items-center gap-4 pl-2.5'>
              <span>{t('clientName')}</span>
              <div className='flex flex-col'>
                <IconButton
                  aria-label={t('sortAsc')}
                  onClick={handleAscSortClick}
                  className={`p-0 text-sm hover:text-gray-700 ${isAscActive ? 'text-gray-700' : 'text-gray-400'}`}
                  icon={<ArrowUpIcon width={14} height={14} />}
                />
                <IconButton
                  aria-label={t('sortDesc')}
                  onClick={handleDescSortClick}
                  className={`p-0 text-sm hover:text-gray-700 ${isDescActive ? 'text-gray-700' : 'text-gray-400'}`}
                  icon={<ArrowDownIcon width={14} height={14} />}
                />
              </div>
            </div>
          </div>
          <div className='w-1/4'>{t('mobileNumber')}</div>
          <div className='w-1/4'>{t('emailAddress')}</div>
          <div className='w-1/4 text-center'>{t('lastVisit')}</div>
        </div>

        <div className='flex flex-col gap-4 lg:gap-0 mb-4'>
          {uniqueList.map((client) => (
            <ClientListItem
              key={client.id}
              client={client}
              onEdit={onEdit}
              isSelected={client.id === selectedId}
            />
          ))}
        </div>
      </InfiniteList>
    </div>
  );
};
