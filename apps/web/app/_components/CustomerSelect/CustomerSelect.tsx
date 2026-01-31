'use client';
import React, { useState, useEffect } from 'react';
import { customerHooks } from '@avoo/hooks';
import {
  CreateCustomerRequest,
  FindCustomerRequest,
  GetCustomersQueryParams,
  Customer,
} from '@avoo/axios/types/apiTypes';
import SearchField from '@/_components/SearchField/SearchField';
import CustomerElement from '@/_components/CustomerElement/CustomerElement';
import FormInput from '@/_components/FormInput/FormInput';
import FormTextArea from '@/_components/FormTextArea/FormTextArea';
import { isEmptyObject } from '@avoo/shared';

type Props = {
  value?: CreateCustomerRequest | FindCustomerRequest;
  onChange: (customer: CreateCustomerRequest | FindCustomerRequest) => void;
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

  const isCustomerValues = (
    obj: CreateCustomerRequest | FindCustomerRequest | undefined,
  ): obj is CreateCustomerRequest => {
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
              value={value.name}
              onChange={(e) => onChange({ ...value, name: e.target.value })}
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
              value={value.email}
              onChange={(e) => onChange({ ...value, email: e.target.value })}
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
              value={value.phone}
              onChange={(e) => onChange({ ...value, phone: e.target.value })}
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
              value={value.notes}
              onChange={(e) => onChange({ ...value, notes: e.target.value })}
            />
          </div>
        </div>
      )}
      {selectedCustomer && <CustomerElement item={selectedCustomer} isCard />}
    </div>
  );
}
