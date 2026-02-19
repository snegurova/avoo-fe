'use client';

import React, { useState, useMemo } from 'react';
import { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';
import MasterListItem from '@/_components/MasterListItem/MasterListItem';
import { IconButton } from '@/_components/IconButton/IconButton';
import ArrowUpIcon from '@/_icons/ArrowUpIcon';
import ArrowDownIcon from '@/_icons/ArrowDownIcon';
import { sortByName, SortDirection } from '@avoo/shared';

type Props = {
  masters: MasterWithRelationsEntityResponse[] | null;
  onEdit?: (master: MasterWithRelationsEntityResponse) => void;
  selectedId?: number | null;
};

export const MasterList = ({ masters, onEdit, selectedId }: Props) => {
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const sorted = useMemo(() => sortByName(masters ?? [], sortDirection), [masters, sortDirection]);

  if (!masters || masters.length === 0) {
    return <div className='py-8 text-center text-gray-500'>No masters yet</div>;
  }

  return (
    <div>
      <div className='hidden lg:flex items-center gap-3 px-8 py-3 mb-8 text-sm text-black font-semibold bg-primary-50'>
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
      <div className='flex flex-col gap-4 lg:gap-0'>
        {sorted.map((master) => (
          <MasterListItem
            key={master.id}
            master={master}
            onEdit={onEdit}
            isSelected={master.id === selectedId}
          />
        ))}
      </div>
    </div>
  );
};

export default MasterList;
