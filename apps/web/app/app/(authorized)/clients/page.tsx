'use client';
import React from 'react';
import { ClientsList } from '@/_components/ClientsList/ClientsList';
import { ClientEditModal } from '@/_components/ClientEditModal/ClientEditModal';

export default function ClientsPage() {
  const [editing, setEditing] = React.useState<number | null>(null);

  return (
    <div className='p-6'>
      <div className='flex items-center justify-between mb-4'>
        <h1 className='text-2xl font-semibold'>Clients</h1>
      </div>
      <div className='bg-white rounded-md p-4'>
        <ClientsList onEdit={(id) => setEditing(id)} />
      </div>

      <ClientEditModal
        id={editing}
        open={!!editing}
        onClose={() => setEditing(null)}
        onSaved={() => {}}
      />
    </div>
  );
}
