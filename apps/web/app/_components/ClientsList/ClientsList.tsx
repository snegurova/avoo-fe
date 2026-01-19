'use client';

import React, { useState, useMemo } from 'react';
import { IconButton } from '@/_components/IconButton/IconButton';
import ArrowDownIcon from '@/_icons/ArrowDownIcon';
import ArrowUpIcon from '@/_icons/ArrowUpIcon';
import { customerHooks } from '@avoo/hooks';
import type { components } from '@avoo/axios/types/generated';
import { sortByName, SortDirection } from '@avoo/shared';
import ClientListItem from '@/_components/ClientListItem/ClientListItem';

type CustomerInfoDto = components['schemas']['CustomerInfoDto'];

type Props = {
  onEdit: (id: number) => void;
  customers?: CustomerInfoDto[] | null;
};

export const ClientsList: React.FC<Props> = ({ onEdit, customers: customersProp }) => {
  const customersFromHook = customerHooks.useGetCustomers();
  const customers = customersProp ?? customersFromHook;
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const sorted = useMemo(
    () => sortByName(customers ?? [], sortDirection),
    [customers, sortDirection],
  );
  if (!customers || (customers && customers.length === 0)) {
    return <div className='py-8 text-center text-gray-500'>No clients yet</div>;
  }

  return (
    <div>
      <div className='hidden lg:flex items-center gap-3 px-8 py-3 mb-8 text-sm text-black font-semibold bg-primary-50'>
        <div className='w-1/4'>
          <div className='flex items-center gap-4 pl-2.5'>
            <span>Client name</span>
            <div className='flex flex-col'>
              <IconButton
                aria-label='sort-asc'
                onClick={() => setSortDirection('asc')}
                className='p-0 text-sm text-gray-400 hover:text-gray-700'
                icon={<ArrowUpIcon width={14} height={14} />}
              />
              <IconButton
                aria-label='sort-desc'
                onClick={() => setSortDirection('desc')}
                className='p-0 text-sm text-gray-400 hover:text-gray-700'
                icon={<ArrowDownIcon width={14} height={14} />}
              />
            </div>
          </div>
        </div>
        <div className='w-1/4'>Mobile number</div>
        <div className='w-1/4'>Email address</div>
        <div className='w-1/4 text-center'>Last visit</div>
      </div>

      <div className='flex flex-col gap-4 lg:gap-0'>
        {sorted.map((client) => (
          <ClientListItem key={client.id} client={client} onEdit={onEdit} />
        ))}
      </div>
    </div>
  );
};
