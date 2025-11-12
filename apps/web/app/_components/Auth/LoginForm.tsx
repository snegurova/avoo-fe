'use client';

import { useRouter } from 'next/navigation';
import { authHooks } from '@avoo/hooks';
import { Button, ButtonFit, ButtonIntent } from '../Button/Button';
import { useState } from 'react';
import FormInput from '../FormInput/FormInput';
import { routes } from '../../_routes/routes';
import { useApiStore } from 'packages/store/src/api.store';

export default function LoginForm() {
  const isPending = useApiStore((state) => state.isPending);

  const router = useRouter();

  const { register, handleSubmit, errors } = authHooks.useLoginForm({
    onSuccess: () => {
      router.push(routes.home);
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  return (
    <form onSubmit={handleSubmit} className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6'>
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

      <Button
        onClick={handleSubmit}
        disabled={isPending}
        loading={isPending}
        fit={ButtonFit.Fill}
        intent={ButtonIntent.Primary}
      >
        Log in
      </Button>
    </form>
  );
}
