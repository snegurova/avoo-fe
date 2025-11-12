'use client';

import { useRouter } from 'next/navigation';
import { authHooks } from '@avoo/hooks';
import { Button, ButtonFit, ButtonIntent } from '../Button/Button';
import { useState } from 'react';
import FormInput from '../FormInput/FormInput';
import { routes } from '../../_routes/routes';
import { useApiStore } from 'packages/store/src/api.store';

export default function RegisterForm() {
  const isPending = useApiStore((state) => state.isPending);

  const router = useRouter();

  const { register, handleSubmit, errors } = authHooks.useRegisterForm({
    onSuccess: () => {
      router.push(routes.home);
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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
        type={showPassword ? 'text' : 'password'}
        placeholder='Password'
        error={errors.password?.message}
        accessoryRight={
          <button type='button' onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <p>👁️</p> : <p>🫣</p>}
          </button>
        }
      />

      <FormInput
        {...register('confirmPassword')}
        type={showConfirmPassword ? 'text' : 'password'}
        placeholder='Confirm Password'
        error={errors.confirmPassword?.message}
        accessoryRight={
          <button type='button' onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <p>👁️</p> : <p>🫣</p>}
          </button>
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
