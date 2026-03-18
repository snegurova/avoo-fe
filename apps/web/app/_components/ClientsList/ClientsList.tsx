'use client';

import React, { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';

import type { CustomerInfoResponse, GetCustomersResponse } from '@avoo/axios/types/apiTypes';
import { customerHooks } from '@avoo/hooks';
import { sortByName, SortDirection } from '@avoo/shared';

import ClientListItem from '@/_components/ClientListItem/ClientListItem';
import { IconButton } from '@/_components/IconButton/IconButton';
import ArrowDownIcon from '@/_icons/ArrowDownIcon';
import ArrowUpIcon from '@/_icons/ArrowUpIcon';

type Props = {
  onEdit: (client: CustomerInfoResponse) => void;
  customers?: CustomerInfoResponse[] | GetCustomersResponse | null;
  selectedId?: number | null;
};

export const ClientsList: React.FC<Props> = ({ onEdit, customers: customersProp, selectedId }) => {
  const t = useTranslations('private.components.ClientsList.ClientsList');
  const customersFromHook = customerHooks.useGetCustomers();
  const customersSource = customersProp ?? customersFromHook;
  const items: CustomerInfoResponse[] = Array.isArray(customersSource)
    ? customersSource
    : (customersSource?.items ?? []);
  const [sortDirection, setSortDirection] = useState<SortDirection>(null);

  const sorted = useMemo(() => sortByName(items ?? [], sortDirection), [items, sortDirection]);
  if (!items || items.length === 0) {
    return <div className='py-8 text-center text-gray-500'>{t('noClientsYet')}</div>;
  }

  return (
    <div className='h-full min-h-0 flex flex-col'>
      <div className='flex flex-col overflow-y-auto h-full min-h-0 max-h-full'>
        <div className='hidden lg:flex sticky top-0 z-9 items-center gap-3 px-8 py-3 text-sm text-black font-semibold bg-primary-50'>
          <div className='w-1/4'>
            <div className='flex items-center gap-4 pl-2.5'>
              <span>{t('clientName')}</span>
              <div className='flex flex-col'>
                <IconButton
                  aria-label={t('sortAsc')}
                  onClick={() => setSortDirection('asc')}
                  className='p-0 text-sm text-gray-400 hover:text-gray-700'
                  icon={<ArrowUpIcon width={14} height={14} />}
                />
                <IconButton
                  aria-label={t('sortDesc')}
                  onClick={() => setSortDirection('desc')}
                  className='p-0 text-sm text-gray-400 hover:text-gray-700'
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
          {sorted.map((client) => (
            <ClientListItem
              key={client.id}
              client={client}
              onEdit={onEdit}
              isSelected={client.id === selectedId}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
