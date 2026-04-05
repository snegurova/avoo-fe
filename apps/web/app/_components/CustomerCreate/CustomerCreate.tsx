import React, { useCallback, useEffect } from 'react';
import { FieldErrors } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import { tv } from 'tailwind-variants';

import { CreateCustomerRequest, CreatePublicCustomerRequest } from '@avoo/axios/types/apiTypes';
import { phoneHooks } from '@avoo/hooks';
import { CreatePublicOrdersData } from '@avoo/hooks';

import FormInput from '@/_components/FormInput/FormInput';
import FormTextArea from '@/_components/FormTextArea/FormTextArea';
import PhoneCodeSelect from '@/_components/PhoneCodeSelect/PhoneCodeSelect';
import { isCustomerValues } from '@/_utils/isCustomerValues';

type Props = {
  phone: string;
  setPhone: (phone: string) => void;
  value: CreateCustomerRequest | CreatePublicCustomerRequest | object;
  onChange: (customer: CreateCustomerRequest | CreatePublicCustomerRequest) => void;
  error?: FieldErrors<CreatePublicOrdersData>['customerData'] | undefined;
  isPublic?: boolean;
  setCustomerDataFilled?: (filled: boolean) => void;
};

const wrapper = tv({
  base: 'grid',
  variants: {
    isPublic: {
      true: 'md:grid-cols-2 gap-6',
      false: 'gap-3',
    },
  },
});

const label = tv({
  base: 'block mb-1 text-sm font-medium',
  variants: {
    isPublic: {
      true: 'text-black',
      false: '',
    },
  },
});

export default function CustomerCreate(props: Props) {
  const tCommon = useTranslations('private.components.CustomerCreate.CustomerCreate');
  const t = useTranslations('private.orders.create');
  const { setPhone, value, onChange, error, isPublic = false, setCustomerDataFilled } = props;
  const [isNameFilled, setIsNameFilled] = React.useState(false);
  const [isEmailFilled, setIsEmailFilled] = React.useState(false);
  const [isPhoneFilled, setIsPhoneFilled] = React.useState(false);

  useEffect(() => {
    if (isNameFilled && isEmailFilled && isPhoneFilled) {
      setCustomerDataFilled?.(true);
    } else {
      setCustomerDataFilled?.(false);
    }
  }, [isNameFilled, isEmailFilled, isPhoneFilled]);

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
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      setPhoneNumber(evt.target.value);
      setIsPhoneFilled(!!evt.target.value);
    },
    [setPhoneNumber],
  );

  const handleNameChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      if (isCustomerValues(value)) {
        onChange({ ...value, name: evt.target.value });
        setIsNameFilled(!!evt.target.value);
      }
    },
    [onChange, value],
  );

  const handleEmailChange = useCallback(
    (evt: React.ChangeEvent<HTMLInputElement>) => {
      if (isCustomerValues(value)) {
        onChange({ ...value, email: evt.target.value });
        setIsEmailFilled(!!evt.target.value);
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
      <div className={wrapper({ isPublic })}>
        <div className=''>
          <label className={label({ isPublic })} htmlFor='name'>
            {t('name')}
          </label>
          <FormInput
            type='text'
            placeholder={tCommon('enterName')}
            id='name'
            value={isCustomerValues(value) ? value.name : ''}
            onChange={handleNameChange}
            error={error?.name?.message}
          />
        </div>
        <div className=''>
          <label className={label({ isPublic })} htmlFor='email'>
            {t('email')}
          </label>
          <FormInput
            type='email'
            placeholder={tCommon('enterEmail')}
            id='email'
            value={isCustomerValues(value) ? value.email : ''}
            onChange={handleEmailChange}
            error={error?.email?.message}
          />
        </div>
        <div className=''>
          <label className={label({ isPublic })} htmlFor='phone'>
            {t('phone')}
          </label>
          <div className='flex items-stretch gap-2 lg:gap-3'>
            <div className='w-[84px] shrink-0 h-11'>
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
                placeholder={tCommon('enterPhone')}
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
              label={t('notes')}
              helperText={t('helperText')}
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
