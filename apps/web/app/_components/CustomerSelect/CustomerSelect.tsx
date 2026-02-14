'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { CreatePrivateOrdersData, customerHooks, phoneHooks } from '@avoo/hooks';
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
import PhoneCodeSelect from '@/_components/PhoneCodeSelect/PhoneCodeSelect';
import { FieldErrors } from 'react-hook-form';

type Props = {
  value?: CreateCustomerRequest | FindCustomerRequest | object;
  onChange: (customer: CreateCustomerRequest | FindCustomerRequest) => void;
  error?: FieldErrors<CreatePrivateOrdersData>['customerData'] | undefined;
};

export function CustomerSelect({ value, onChange, error }: Props) {
  const [search, setSearch] = useState('');
  const [params, setParams] = useState<GetCustomersQueryParams>({ limit: 100 });
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [phone, setPhone] = useState('');

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      search: search.trim() || undefined,
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
    obj: CreateCustomerRequest | FindCustomerRequest | object | undefined,
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

  useEffect(() => {
    if (isCustomerValues(value)) {
      onChange({ ...value, phone });
    }
  }, [phone]);

  const { countryCode, phoneNumber, setCountryCode, setPhoneNumber } = phoneHooks.usePhoneField({
    value: isCustomerValues(value) ? value.phone : '',
    onChange: (newPhone) => {
      if (isCustomerValues(value)) {
        setPhone(newPhone);
      }
    },
  });

  const handlePhoneCodeChange = useCallback(
    (code: string) => setCountryCode(code),
    [setCountryCode],
  );

  const handlePhoneNumberChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => setPhoneNumber(evt.target.value),
    [setPhoneNumber],
  );

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
              error={error?.name?.message}
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
              error={error?.email?.message}
            />
          </div>
          <div className=''>
            <label className='block mb-1 text-sm font-medium' htmlFor='phone'>
              Phone
            </label>
            <div className='flex items-stretch gap-6 md:gap-8 lg:gap-6'>
              <div className='w-[84px] shrink-0'>
                <PhoneCodeSelect
                  id='phone-code'
                  value={countryCode}
                  onChange={handlePhoneCodeChange}
                  className='w-full h-full'
                />
              </div>

              <div className='flex-1'>
                <FormInput
                  type='text'
                  placeholder='Enter phone'
                  id='phone'
                  value={phoneNumber}
                  onChange={handlePhoneNumberChange}
                  error={error?.phone?.message}
                />
              </div>
            </div>
          </div>
          <div className=''>
            <FormTextArea
              id='notes'
              name='notes'
              value={value.notes ?? ''}
              onChange={(e) => onChange({ ...value, notes: e.target.value })}
              label='Notes'
              helperText='Additional information about the client'
              maxLength={200}
              classNames={{
                label: 'block font-medium',
                textarea:
                  'block w-full text-sm text-black border border-gray-200 p-3 rounded-lg min-h-[70px] focus:outline-none focus:ring-1 focus:ring-purple-800',
              }}
            />
          </div>
        </div>
      )}
      {selectedCustomer && <CustomerElement item={selectedCustomer} isCard />}
    </div>
  );
}
