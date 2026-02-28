'use client';

import React from 'react';
import Controls from '@/_components/Controls/Controls';
import { customerHooks } from '@avoo/hooks';
import { ClientsList } from '@/_components/ClientsList/ClientsList';
import type { CustomerInfoResponse } from '@avoo/axios/types/apiTypes';
import { ClientEditModal } from '@/_components/ClientEditModal/ClientEditModal';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';

export default function ClientsPage() {
  const [searchQuery, setSearchQuery] = React.useState('');

  const customers = customerHooks.useGetCustomers()?.items ?? null;

  const filtered = customerHooks.useFilterCustomers(customers, searchQuery);

  const [editingClient, setEditingClient] = React.useState<CustomerInfoResponse | null>(null);

  const handleEdit = React.useCallback((client: CustomerInfoResponse) => {
    setEditingClient(client);
  }, []);

  const handleCloseEdit = React.useCallback(() => {
    setEditingClient(null);
  }, []);

  return (
    <AppWrapper>
      <div className='p-6 flex-1 min-h-0 overflow-auto lg:overflow-hidden hide-scrollbar flex flex-col'>
        <Controls
          title='Clients'
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder='Search by name, phone or email'
          titleClassName={'self-center md:self-auto text-center md:text-left'}
          searchContainerClassName={
            'order-3 md:order-2 w-auto mx-auto md:mx-0 md:ml-auto max-w-[135px] focus-within:max-w-full overflow-hidden transition-[max-width] duration-300 ease-in-out md:max-w-none md:overflow-visible md:transition-none'
          }
          searchClassName={
            'w-full md:w-[306px] md:mr-8 lg:mr-12 truncate transition-all duration-300'
          }
        />

        <div className='bg-white rounded-md p-4 flex-1 min-h-0 overflow-hidden'>
          <ClientsList
            onEdit={handleEdit}
            customers={filtered}
            selectedId={editingClient?.id ?? null}
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
