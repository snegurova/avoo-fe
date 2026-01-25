'use client';
import React, { useState, useEffect } from 'react';
import { customerHooks } from '@avoo/hooks';
import {
  CreateOrFindCustomerRequest,
  GetCustomersQueryParams,
  Customer,
} from '@avoo/axios/types/apiTypes';
import SearchField from '@/_components/SearchField/SearchField';
import CustomerElement from '@/_components/CustomerElement/CustomerElement';
import FormInput from '@/_components/FormInput/FormInput';
import FormTextArea from '@/_components/FormTextArea/FormTextArea';
import { isEmptyObject } from '@avoo/shared';

type Props = {
  value?: CreateOrFindCustomerRequest;
  onChange: (customer: CreateOrFindCustomerRequest) => void;
  error?: string;
};

export function CustomerSelect({ value, onChange, error }: Props) {
  const [search, setSearch] = useState('');
  const [params, setParams] = useState<GetCustomersQueryParams>({ limit: 100 });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      name: search.trim() || undefined,
    }));
  }, [search]);

  const { items } = customerHooks.useGetCustomers(params);

  useEffect(() => {
    if (value && !isEmptyObject(value) && 'id' in value) {
      const customer = items.find((item) => item.id === value.id) || null;
      setSelectedCustomer(customer);
    } else {
      setSelectedCustomer(null);
    }
  }, [value]);

  const addClientFields = () => {
    onChange({ name: search.trim(), email: '', phone: '', notes: '' });
  };

  const isCustomerValues = (obj: unknown): obj is CreateOrFindCustomerRequest => {
    return !!(
      obj &&
      typeof obj === 'object' &&
      !Array.isArray(obj) &&
      Object.prototype.hasOwnProperty.call(obj, 'name') &&
      Object.prototype.hasOwnProperty.call(obj, 'email') &&
      Object.prototype.hasOwnProperty.call(obj, 'phone') &&
      Object.prototype.hasOwnProperty.call(obj, 'notes')
    );
  };

  return (
    <div className='w-full'>
      <SearchField
        label='Client'
        value={value || null}
        onChange={onChange}
        items={items}
        search={search}
        setSearch={setSearch}
        ItemElement={CustomerElement}
        onAddClick={addClientFields}
        searchMode={isEmptyObject(value)}
        error={error}
      />
      {isCustomerValues(value) && (
        <div className='grid gap-3'>
          <div className=''>
            <label className='block mb-1 text-sm font-medium' htmlFor='name'>
              Name
            </label>
            <FormInput
              type='text'
              placeholder='Enter name'
              id='name'
              value={(value as CreateOrFindCustomerRequest).name}
              onChange={(e) =>
                onChange({ ...(value as CreateOrFindCustomerRequest), name: e.target.value })
              }
            />
          </div>
          <div className=''>
            <label className='block mb-1 text-sm font-medium' htmlFor='email'>
              Email
            </label>
            <FormInput
              type='email'
              placeholder='Enter email'
              id='email'
              value={(value as CreateOrFindCustomerRequest).email}
              onChange={(e) =>
                onChange({ ...(value as CreateOrFindCustomerRequest), email: e.target.value })
              }
            />
          </div>
          <div className=''>
            <label className='block mb-1 text-sm font-medium' htmlFor='phone'>
              Phone
            </label>
            <FormInput
              type='text'
              placeholder='Enter phone'
              id='phone'
              value={(value as CreateOrFindCustomerRequest).phone}
              onChange={(e) =>
                onChange({ ...(value as CreateOrFindCustomerRequest), phone: e.target.value })
              }
              error={error ? 'Phone is required' : undefined}
            />
          </div>
          <div className=''>
            <label className='block mb-1 text-sm font-medium' htmlFor='notes'>
              Notes
            </label>
            <FormTextArea
              className='resize-none'
              rows={3}
              placeholder='Enter notes'
              id='notes'
              value={(value as CreateOrFindCustomerRequest).notes}
              onChange={(e) =>
                onChange({ ...(value as CreateOrFindCustomerRequest), notes: e.target.value })
              }
            />
          </div>
        </div>
      )}
      {selectedCustomer && <CustomerElement item={selectedCustomer} isCard />}
    </div>
  );
}
