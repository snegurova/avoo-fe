import React, { useCallback } from 'react';
import FormInput from '@/_components/FormInput/FormInput';
import FormTextArea from '@/_components/FormTextArea/FormTextArea';
import PhoneCodeSelect from '@/_components/PhoneCodeSelect/PhoneCodeSelect';
import { phoneHooks } from '@avoo/hooks';
import { isCustomerValues } from '@/_utils/isCustomerValues';
import { CreatePublicCustomerRequest, CreateCustomerRequest } from '@avoo/axios/types/apiTypes';
import { FieldErrors } from 'react-hook-form';
import { CreatePublicOrdersData } from '@avoo/hooks';
import { tv } from 'tailwind-variants';

type Props = {
  phone: string;
  setPhone: (phone: string) => void;
  value: CreateCustomerRequest | CreatePublicCustomerRequest | object;
  onChange: (customer: CreateCustomerRequest | CreatePublicCustomerRequest) => void;
  error?: FieldErrors<CreatePublicOrdersData>['customerData'] | undefined;
  isFullWidth?: boolean;
};

const wrapper = tv({
  base: 'grid gap-3',
  variants: {
    isFullWidth: {
      true: 'md:grid-cols-2',
      false: '',
    },
  },
});

export default function CustomerCreate(props: Props) {
  const { setPhone, value, onChange, error, isFullWidth = false } = props;

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

  const handleNameChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      if (isCustomerValues(value)) {
        onChange({ ...value, name: evt.target.value });
      }
    },
    [onChange, value],
  );

  const handleEmailChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      if (isCustomerValues(value)) {
        onChange({ ...value, email: evt.target.value });
      }
    },
    [onChange, value],
  );

  const handleNotesChange = useCallback(
    (evt: React.ChangeEvent<HTMLTextAreaElement>) => {
      if (isCustomerValues(value)) {
        onChange({ ...value, notes: evt.target.value });
      }
    },
    [onChange, value],
  );

  return (
    <>
      <div className={wrapper({ isFullWidth })}>
        <div className=''>
          <label className='block mb-1 text-sm font-medium' htmlFor='name'>
            Name
          </label>
          <FormInput
            type='text'
            placeholder='Enter name'
            id='name'
            value={isCustomerValues(value) ? value.name : ''}
            onChange={handleNameChange}
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
            value={isCustomerValues(value) ? value.email : ''}
            onChange={handleEmailChange}
            error={error?.email?.message}
          />
        </div>
        <div className=''>
          <label className='block mb-1 text-sm font-medium' htmlFor='phone'>
            Phone
          </label>
          <div className='flex items-stretch gap-2 lg:gap-3'>
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
        {isCustomerValues(value) && Object.prototype.hasOwnProperty.call(value, 'notes') && (
          <div className=''>
            <FormTextArea
              id='notes'
              name='notes'
              value={value.notes}
              onChange={handleNotesChange}
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
        )}
      </div>
    </>
  );
}
