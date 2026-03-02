'use client';
import React, { useState, useEffect } from 'react';
import { CreatePrivateOrdersData, customerHooks } from '@avoo/hooks';
import {
  CreateCustomerRequest,
  FindCustomerRequest,
  GetCustomersQueryParams,
  Customer,
} from '@avoo/axios/types/apiTypes';
import SearchField from '@/_components/SearchField/SearchField';
import CustomerElement from '@/_components/CustomerElement/CustomerElement';
import { isEmptyObject } from '@avoo/shared';
import { FieldErrors } from 'react-hook-form';
import CustomerCreate from '@/_components/CustomerCreate/CustomerCreate';
import { isCustomerValues } from '@/_utils/isCustomerValues';

type Props = {
  value?: CreateCustomerRequest | FindCustomerRequest | object;
  onChange: (customer: CreateCustomerRequest | FindCustomerRequest) => void;
  error?: FieldErrors<CreatePrivateOrdersData>['customerData'] | undefined;
};

export function CustomerSelect({ value, onChange, error }: Props) {
  const [search, setSearch] = useState('');
  const [params, setParams] = useState<GetCustomersQueryParams>({ limit: 4 });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [phone, setPhone] = useState('');

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      search: search.trim() || undefined,
    }));
  }, [search]);

  const { data, fetchNextPage, hasNextPage } = customerHooks.useGetCustomersInfinite(params);

  const items = (data?.pages.flatMap((page) => page?.data?.items) || []).filter(
    (item): item is Customer => item !== undefined,
  );

  useEffect(() => {
    if (value && !isEmptyObject(value) && 'id' in value) {
      const customer = items.find((item) => item?.id === value.id) || null;
      setSelectedCustomer(customer);
    } else {
      setSelectedCustomer(null);
    }
  }, [value]);

  const addClientFields = () => {
    onChange({ name: search.trim(), email: '', phone: '', notes: '' });
  };

  useEffect(() => {
    if (isCustomerValues(value)) {
      onChange({ ...value, phone });
    }
  }, [phone]);

  return (
    <div className='w-full'>
      <SearchField
        label='Client'
        value={value}
        onChange={onChange}
        items={items}
        search={search}
        setSearch={setSearch}
        ItemElement={CustomerElement}
        onAddClick={addClientFields}
        searchMode={isEmptyObject(value)}
        error={error?.message}
        hasMore={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
      {isCustomerValues(value) && (
        <CustomerCreate
          phone={phone}
          setPhone={setPhone}
          value={value}
          onChange={onChange}
          error={error}
        />
      )}
      {selectedCustomer && <CustomerElement item={selectedCustomer} isCard />}
    </div>
  );
}
