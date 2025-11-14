'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authHooks } from '@avoo/hooks';
import { Button, ButtonFit, ButtonIntent } from '../Button/Button';
import FormInput from '../FormInput/FormInput';
import { routes } from '../../_routes/routes';
import { useApiStore } from 'packages/store/src/api.store';
import { utils } from 'packages/hooks/utils/utils';

export default function LoginForm() {
  const isPending = useApiStore((state) => state.isPending);

  const router = useRouter();

  const { register, handleSubmit, errors } = authHooks.useLoginForm({
    onSuccess: () => {
      router.push(routes.home);
    },
  });

  const { value: isShowPassword, toggle } = utils.useBoolean(false);

  const AccessoryRight = () => {
    return (
      <button type='button' onClick={toggle}>
        {isShowPassword ? <p>👁️</p> : <p>🫣</p>}
      </button>
    );
  };

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
        type={isShowPassword ? 'text' : 'password'}
        placeholder='Password'
        error={errors.password?.message}
        accessoryRight={
          <AccessoryRight />
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
      <div className='text-center mt-2'>
        <Link href={routes.forgotPassword} className='text-blue-600 hover:underline text-sm'>
          Forgot password?
        </Link>
      </div>
    </form>
  );
}
