'use client';

import React, { useState } from 'react';
import { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';
import MasterListItem from '@/_components/MasterListItem/MasterListItem';
import { IconButton } from '@/_components/IconButton/IconButton';
import ArrowUpIcon from '@/_icons/ArrowUpIcon';
import ArrowDownIcon from '@/_icons/ArrowDownIcon';
import { SortDirection, fetchAllAndSort } from '@avoo/shared';
import { masterApi } from '@avoo/axios/src/modules/master';
import InfiniteList from '../InfiniteList/InfiniteList';

type Props = {
  masters: MasterWithRelationsEntityResponse[] | null;
  onEdit?: (master: MasterWithRelationsEntityResponse) => void;
  selectedId?: number | null;
  incrementPage?: () => void;
  hasMore?: boolean;
};

export const MasterList = ({ masters, onEdit, selectedId, incrementPage, hasMore }: Props) => {
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);
  const [list, setList] = useState(() => masters ?? []);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!sortDirection) {
      setList(masters ?? []);
      setError(null);
    }
  }, [masters, sortDirection]);

  React.useEffect(() => {
    if (!sortDirection) return;

    let isComponentMounted = true;
    const fetchAndSort = async () => {
      setError(null);
      const sorted = await fetchAllAndSort(
        (params) => masterApi.getMastersInfo(params),
        (item: MasterWithRelationsEntityResponse) => item.name ?? '',
        sortDirection,
      );

      if (isComponentMounted) {
        setList(sorted);
      }
    };

    fetchAndSort();

    return () => {
      isComponentMounted = false;
    };
  }, [sortDirection]);

  const uniqueList = React.useMemo(() => {
    const uniqueById = new Map<number, MasterWithRelationsEntityResponse>();
    for (const item of list) {
      if (!uniqueById.has(item.id)) {
        uniqueById.set(item.id, item);
      }
    }

    return Array.from(uniqueById.values());
  }, [list]);

  if (uniqueList.length === 0) {
    return <div className='py-8 text-center text-gray-500'>No masters yet</div>;
  }

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
        <div className='w-1/5'>Mobile number</div>
        <div className='w-1/5'>Email address</div>
        <div className='w-1/5'>Languages</div>
        <div className='w-12 text-right'>Actions</div>
      </div>

      <InfiniteList
        className='flex flex-col overflow-y-auto gap-4 max-h-[50vh] pb-3'
        hasMore={hasMore}
        onLoadMore={incrementPage}
      >
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
