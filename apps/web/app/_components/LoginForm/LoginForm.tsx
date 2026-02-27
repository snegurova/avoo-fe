'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { authHooks } from '@avoo/hooks';
import { Button, ButtonFit, ButtonIntent } from '@/_components/Button/Button';
import FormInput from '@/_components/FormInput/FormInput';
import { AppRoutes } from '@/_routes/routes';
import { useApiStatusStore } from '@avoo/store';
import { utils } from '@avoo/hooks';
import ShowPasswordToggler from '@/_components/ShowPasswordToggler/ShowPasswordToggler';
import { useEffect, useState } from 'react';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { routerUtils } from '@/_utils/routerUtils';

export default function LoginForm() {
  const isPending = useApiStatusStore((state) => state.isPending);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [returnUrl, setReturnUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = searchParams.get('returnUrl');
    if (url) {
      setReturnUrl(decodeURIComponent(url));
    }
  }, [searchParams, router]);

  const { register, handleSubmit, errors } = authHooks.useLoginForm({
    onSuccess: () => {
      const targetUrl = returnUrl && routerUtils.isValidRoute(returnUrl)
        ? routerUtils.toRoute(returnUrl)
        : AppRoutes.Home;
      router.replace(targetUrl);

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
        <Link
          href={localizationHooks.useWithLocale(AppRoutes.ForgotPassword)}
          className='text-blue-600 hover:underline text-sm'
        >
          Forgot password?
        </Link>
      </div>
    </form>
  );
}
