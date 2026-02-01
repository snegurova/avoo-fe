'use client';

import React from 'react';
import Controls from '@/_components/Controls/Controls';
import { IconButton } from '@/_components/IconButton/IconButton';
import { routerHooks } from '@/_hooks/routerHooks';
import { customerHooks } from '@avoo/hooks';
import { ClientsList } from '@/_components/ClientsList/ClientsList';
import { ClientEditModal } from '@/_components/ClientEditModal/ClientEditModal';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';

export default function ClientsPage() {
  const handleBackClick = routerHooks.useHandleNavigateToHomeClick();

  const [searchQuery, setSearchQuery] = React.useState('');

  const customers = customerHooks.useGetCustomers()?.items ?? null;

  const filtered = customerHooks.useFilterCustomers(customers, searchQuery);

  const [editing, setEditing] = React.useState<number | null>(null);

  const handleEdit = React.useCallback((id: number) => {
    setEditing(id);
  }, []);

  const handleCloseEdit = React.useCallback(() => {
    setEditing(null);
  }, []);

  return (
    <AppWrapper>
      <div className='p-6'>
        <IconButton icon='⬅' onClick={handleBackClick} ariaLabel='Back' />

        <div className='mb-[12px] md:mb-[28px] lg:mb-[32px]'>
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
        </div>

        <div className='bg-white rounded-md p-4'>
          <ClientsList onEdit={handleEdit} customers={filtered} />
        </div>

        <ClientEditModal id={editing} open={editing !== null} onClose={handleCloseEdit} />
      </div>
    </AppWrapper>
  );
}
