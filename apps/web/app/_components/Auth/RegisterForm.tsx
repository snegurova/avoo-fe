'use client';

import { useRouter } from 'next/navigation';
import { authHooks } from '@avoo/hooks';
import { Button, ButtonFit, ButtonIntent } from '../Button/Button';
import { memo } from 'react';
import FormInput from '../FormInput/FormInput';
import { routes } from '../../_routes/routes';
import { useApiStore } from 'packages/store/src/api.store';
import { utils } from 'packages/hooks/utils/utils';

const AccessoryRight = memo(({ value, toggle }: { value: boolean; toggle: () => void }) => {
  return (
    <button type='button' onClick={toggle}>
      {value ? <p>👁️</p> : <p>🫣</p>}
    </button>
  );
});

AccessoryRight.displayName = 'AccessoryRight';

export default function RegisterForm() {
  const isPending = useApiStore((state) => state.isPending);

  const router = useRouter();

  const { register, handleSubmit, errors } = authHooks.useRegisterForm({
    onSuccess: () => {
      router.push(routes.Home);
    },
  });

  const { value: isShowPassword, toggle } = utils.useBoolean(false);
  const { value: isShowConfirmPassword, toggle: toggleConfirmPassword } = utils.useBoolean(false);

  return (
    <form onSubmit={handleSubmit} className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6'>
      <FormInput
        {...register('name')}
        type='text'
        placeholder='Full Name'
        error={errors.name?.message}
      />

      <FormInput
        {...register('email')}
        type='email'
        placeholder='Email'
        error={errors.email?.message}
      />

      <FormInput
        {...register('password')}
        type={isShowPassword ? 'text' : 'password'}
        placeholder='Password'
        error={errors.password?.message}
        accessoryRight={
          <AccessoryRight value={isShowPassword} toggle={toggle} />
        }
      />

      <FormInput
        {...register('confirmPassword')}
        type={isShowConfirmPassword ? 'text' : 'password'}
        placeholder='Confirm Password'
        error={errors.confirmPassword?.message}
        accessoryRight={
          <AccessoryRight value={isShowConfirmPassword} toggle={toggleConfirmPassword} />
        }
      />

      <div>
        <div className='flex items-start'>
          <div className='flex items-center h-5'>
            <input
              {...register('agreeToTerms')}
              type='checkbox'
              className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300'
            />
          </div>
          <label className='ml-2 text-sm text-gray-600'>
            I agree to the Privacy Policy, Terms of Service and Terms of Business.
          </label>
        </div>
        {errors.agreeToTerms && (
          <p className='mt-1 text-sm text-red-500'>{errors.agreeToTerms.message}</p>
        )}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isPending}
        loading={isPending}
        fit={ButtonFit.Fill}
        intent={ButtonIntent.Primary}
      >
        Create Account
      </Button>
    </form>
  );
}
