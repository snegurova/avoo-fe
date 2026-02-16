'use client';

import React, { useState, useMemo } from 'react';
import { Exception } from '@avoo/axios/types/apiTypes';
import { IconButton } from '@/_components/IconButton/IconButton';
import ArrowUpIcon from '@/_icons/ArrowUpIcon';
import ArrowDownIcon from '@/_icons/ArrowDownIcon';
import { sortByName, SortDirection } from '@avoo/shared';
import TimeOffListItem from '../TimeOffListItem/TimeOffListItem';

type Props = {
  items: Exception[] | null;
  onEdit?: (id: number) => void;
  onDelete?: (id: number) => void;
};

const TimeOffList = ({ items, onEdit, onDelete }: Props) => {
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const list = useMemo(() => {
    const base = items ?? [];
    if (!sortDirection) return base;

    const withName = base.map((it) => ({
      ...it,
      name: String(it.masterId ?? it.userId ?? ''),
    }));
    const sorted = sortByName(withName, sortDirection);
    return sorted;
  }, [items, sortDirection]);

  if (!list || list.length === 0) return null;

  return (
    <div>
      <div className='hidden lg:flex items-center gap-3 px-8 py-3 text-sm text-black font-semibold bg-primary-50'>
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

      <ul className='flex flex-col gap-4 lg:gap-0'>
        {list.map((item) => (
          <li key={item.id} className='list-none'>
            <TimeOffListItem item={item} onEdit={onEdit} onDelete={onDelete} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TimeOffList;
