'use client';

import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useRouter, useSearchParams } from 'next/navigation';

import { authHooks } from '@avoo/hooks';
import { utils } from '@avoo/hooks';
import { messages } from '@avoo/intl/messages/public/login/form';
import { useApiStatusStore } from '@avoo/store';

import { Button, ButtonFit, ButtonIntent } from '@/_components/Button/Button';
import FormInput from '@/_components/FormInput/FormInput';
import ShowPasswordToggler from '@/_components/ShowPasswordToggler/ShowPasswordToggler';
import { AppRoutes } from '@/_routes/routes';
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
      const targetUrl =
        returnUrl && routerUtils.isValidRoute(returnUrl)
          ? routerUtils.toRoute(returnUrl)
          : AppRoutes.Home;
      router.replace(targetUrl);
    },
  });

  const { value: isShowPassword, toggleValue: toggleShowPassword } = utils.useBooleanState(false);

  return (
    <form onSubmit={handleSubmit} className='w-full flex flex-col gap-6'>
      <label>
        <span className='text-sm font-medium mb-1 leading-none block'>
          <FormattedMessage {...messages.emailLabel} />
        </span>
        <FormInput
          {...register('email')}
          type='email'
          placeholder={messages.emailPlaceholder.defaultMessage}
          error={errors.email?.message}
        />
      </label>

      <label>
        <span className='text-sm font-medium mb-1 leading-none block'>
          <FormattedMessage {...messages.passwordLabel} />
        </span>
        <FormInput
          {...register('password')}
          type={isShowPassword ? 'text' : 'password'}
          placeholder={messages.passwordPlaceholder.defaultMessage}
          error={errors.password?.message}
          accessory={<ShowPasswordToggler value={isShowPassword} toggle={toggleShowPassword} />}
        />
      </label>

      <Button
        onClick={handleSubmit}
        disabled={isPending}
        loading={isPending}
        fit={ButtonFit.Fill}
        intent={ButtonIntent.Primary}
      >
        <FormattedMessage {...messages.button} />
      </Button>
    </form>
  );
}
