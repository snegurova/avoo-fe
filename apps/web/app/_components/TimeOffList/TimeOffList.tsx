'use client';

import React, { useState } from 'react';
import { Exception } from '@avoo/axios/types/apiTypes';
import { IconButton } from '@/_components/IconButton/IconButton';
import ArrowUpIcon from '@/_icons/ArrowUpIcon';
import ArrowDownIcon from '@/_icons/ArrowDownIcon';
import { SortDirection, fetchAllAndSort } from '@avoo/shared';
import { exceptionApi } from '@avoo/axios/src/modules/exception';
import TimeOffListItem from '../TimeOffListItem/TimeOffListItem';
import InfiniteList from '../InfiniteList/InfiniteList';

type Props = {
  items: Exception[] | null;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
  incrementPage?: () => void;
  hasMore?: boolean;
};

const TimeOffList = ({ items, onEdit, onDelete, incrementPage, hasMore }: Props) => {
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const [list, setList] = useState(() => items ?? []);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!sortDirection) {
      setList(items ?? []);
      setError(null);
    }
  }, [items, sortDirection]);

  React.useEffect(() => {
    if (!sortDirection) return;

    let isComponentMounted = true;
    const fetchAndSort = async () => {
      setError(null);
      const sorted = await fetchAllAndSort(
        (params) => exceptionApi.getExceptions(params),
        (item: Exception) => String(item.masterId ?? item.userId ?? ''),
        sortDirection,
      );
      if (isComponentMounted) setList(sorted);
    };

    fetchAndSort();

    return () => {
      isComponentMounted = false;
    };
  }, [sortDirection]);

  const uniqueList = React.useMemo(() => {
    const uniqueById = new Map<number, Exception>();
    for (const item of list) {
      if (!uniqueById.has(item.id)) {
        uniqueById.set(item.id, item);
      }
    }

    return Array.from(uniqueById.values());
  }, [list]);

  if (uniqueList.length === 0) return null;

  return (
    <div>
      {error ? <div className='px-8 py-2 text-sm'>{error}</div> : null}
      <div className='hidden lg:flex sticky top-0 z-9 items-center gap-3 px-8 py-3 text-sm text-black font-semibold bg-primary-50'>
        <div className='w-1/5'>
          <div className='flex items-center gap-4 pl-2.5'>
            <span>Master name</span>
            <div className='flex flex-col'>
              <IconButton
                ariaLabel='sort-asc'
                onClick={() => setSortDirection('asc')}
                className='p-0 text-sm text-gray-400 hover:text-gray-700'
                icon={<ArrowUpIcon width={14} height={14} />}
              />
              <IconButton
                ariaLabel='sort-desc'
                onClick={() => setSortDirection('desc')}
                className='p-0 text-sm text-gray-400 hover:text-gray-700'
                icon={<ArrowDownIcon width={14} height={14} />}
              />
            </div>
          </div>
        </div>
        <div className='w-1/5'>Exception type</div>
        <div className='w-1/5'>Date</div>
        <div className='w-1/5'>Note</div>
        <div className='w-12 text-right'>Actions</div>
      </div>

      <InfiniteList
        className='flex flex-col overflow-y-auto gap-4 max-h-[70vh]'
        hasMore={hasMore}
        onLoadMore={incrementPage}
      >
        <ul className='flex flex-col gap-4 lg:gap-0 mb-4'>
          {uniqueList.map((item) => (
            <li key={item.id}>
              <TimeOffListItem item={item} onEdit={onEdit} onDelete={onDelete} />
            </li>
          ))}
        </ul>
      </InfiniteList>
    </div>
  );
};

export default TimeOffList;
