'use client';

import React from 'react';
import { useTranslations } from 'next-intl';

import type { CustomerInfoResponse } from '@avoo/axios/types/apiTypes';
import { customerHooks, useDebounce } from '@avoo/hooks';

import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import { ClientEditModal } from '@/_components/ClientEditModal/ClientEditModal';
import { ClientsList } from '@/_components/ClientsList/ClientsList';
import Controls, { ControlsVariant } from '@/_components/Controls/Controls';

export default function ClientsPage() {
  const t = useTranslations('private.clients');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortDirection, setSortDirection] = React.useState<'asc' | 'desc' | undefined>(undefined);
  const DEFAULT_LIMIT = 10;
  const debouncedSearch = useDebounce(searchQuery);
  const queryParams = React.useMemo(
    () => ({ limit: DEFAULT_LIMIT, search: debouncedSearch || undefined, sort: sortDirection }),
    [debouncedSearch, sortDirection],
  );
  const { data, fetchNextPage, hasNextPage } = customerHooks.useGetCustomersInfinite(queryParams);
  const customers = React.useMemo(
    () => data?.pages.flatMap((page) => page.data?.items ?? []) ?? [],
    [data],
  );

  const [editingClient, setEditingClient] = React.useState<CustomerInfoResponse | null>(null);

  const handleEdit = React.useCallback((client: CustomerInfoResponse) => {
    setEditingClient(client);
  }, []);

  const handleCloseEdit = React.useCallback(() => {
    setEditingClient(null);
  }, []);

  return (
    <AppWrapper>
      <div className='pt-4 lg:pt-0 pb-6 px-6 flex-1 min-h-0 overflow-auto lg:overflow-hidden hide-scrollbar flex flex-col'>
        <Controls
          title={t('clients')}
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder={t('searchNamePhoneEmail')}
          titleClassName='self-center md:self-auto text-center md:text-left'
          searchClassName='w-full md:w-[306px] truncate transition-all duration-300'
          variant={ControlsVariant.StackedSearch}
        />

        <div className='bg-white rounded-md p-4 flex-1 min-h-0 overflow-hidden'>
          <ClientsList
            onEdit={handleEdit}
            customers={customers}
            selectedId={editingClient?.id ?? null}
            incrementPage={fetchNextPage}
            hasMore={!!hasNextPage}
            sortDirection={sortDirection ?? null}
            onSortChange={setSortDirection}
          />
        </div>

        <ClientEditModal
          id={editingClient?.id ?? null}
          client={editingClient}
          open={editingClient !== null}
          onClose={handleCloseEdit}
        />
      </div>
    </AppWrapper>
  );
}
