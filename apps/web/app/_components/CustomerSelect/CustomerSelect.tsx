'use client';
import React, { useState, useEffect } from 'react';
import { customerHooks } from '@avoo/hooks';
import { CreateCustomerRequest, GetCustomersQueryParams } from '@avoo/axios/types/apiTypes';
import SearchField from '../SearchField/SearchField';

type Props = {
  value?: CreateCustomerRequest | { id: number } | undefined;
  onChange: (customer: CreateCustomerRequest) => void;
};

export function CustomerSelect({ value, onChange }: Props) {
  const [search, setSearch] = useState('');
  const [params, setParams] = useState<GetCustomersQueryParams>({ limit: 3 });

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      name: search.trim() || undefined,
    }));
  }, [search]);

  const { items } = customerHooks.useGetCustomers(params);

  return (
    <>
      <SearchField
        label='Client'
        value={value}
        onChange={onChange}
        items={items}
        ItemElement={() => null}
        search={search}
        setSearch={setSearch}
      />
    </>
  );
}

// type MiniFormProps = {
//   initialData?: CreateCustomerRequest;
//   onSave: (c: CreateCustomerRequest) => void;
//   onCancel: () => void;
// };

// function CustomerMiniForm({ initialData, onSave, onCancel }: MiniFormProps) {
//   const [customerData, setCustomerData] = useState<CreateCustomerRequest>(
//     initialData ?? { name: '', phone: '', email: '', notes: '' },
//   );

//   return (
//     <div className='flex flex-col gap-3 p-4'>
//       <TextField
//         label='Name'
//         value={customerData.name}
//         onChange={(e) => setCustomerData({ ...customerData, name: e.target.value })}
//       />
//       <TextField
//         label='Phone'
//         value={customerData.phone}
//         onChange={(e) => setCustomerData({ ...customerData, phone: e.target.value })}
//       />
//       <TextField
//         label='Email'
//         value={customerData.email}
//         onChange={(e) => setCustomerData({ ...customerData, email: e.target.value })}
//       />
//       <TextField
//         label='Notes'
//         value={customerData.notes}
//         onChange={(e) => setCustomerData({ ...customerData, notes: e.target.value })}
//       />

//       <div className='mt-2 flex gap-2'>
//         <button className='rounded border px-3 py-1' onClick={onCancel}>
//           Cancel
//         </button>
//         <button className='rounded bg-black px-3 py-1 text-white' onClick={() => onSave(form)}>
//           OK
//         </button>
//       </div>
//     </div>
//   );
// }
