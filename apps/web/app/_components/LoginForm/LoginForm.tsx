'use client';

import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authHooks } from '@avoo/hooks';
import { Button, ButtonFit, ButtonIntent } from '@/_components/Button/Button';
import FormInput from '@/_components/FormInput/FormInput';
import { appRoutes } from '@/_routes/routes';
import { useApiStatusStore } from '@avoo/store';
import { utils } from '@avoo/hooks';
import ShowPasswordToggler from '@/_components/ShowPasswordToggler/ShowPasswordToggler';

export default function LoginForm() {
  const isPending = useApiStatusStore((state) => state.isPending);

  const router = useRouter();

  const { register, handleSubmit, errors } = authHooks.useLoginForm({
    onSuccess: () => {
      router.push(appRoutes.Home);
    },
  });

  const { value: isShowPassword, toggleValue: toggleShowPassword } = utils.useBooleanState(false);

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
        accessory={<ShowPasswordToggler value={isShowPassword} toggle={toggleShowPassword} />}
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
        <Link href={appRoutes.ForgotPassword} className='text-blue-600 hover:underline text-sm'>
          Forgot password?
        </Link>
      </div>
    </form>
  );
}
