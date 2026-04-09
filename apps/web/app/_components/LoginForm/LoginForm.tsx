'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { authHooks } from '@avoo/hooks';
import { utils } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';

import { Button, ButtonFit, ButtonIntent } from '@/_components/Button/Button';
import FormInput from '@/_components/FormInput/FormInput';
import ShowPasswordToggler from '@/_components/ShowPasswordToggler/ShowPasswordToggler';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { useToast } from '@/_hooks/useToast';
import { AppRoutes } from '@/_routes/routes';
import { routerUtils } from '@/_utils/routerUtils';

export default function LoginForm() {
  const t = useTranslations('public.login.form');
  const isPending = useApiStatusStore((state) => state.isPending);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [returnUrl, setReturnUrl] = useState<string | null>(null);
  const toast = useToast();

  useEffect(() => {
    const url = searchParams.get('returnUrl');
    if (url) {
      setReturnUrl(decodeURIComponent(url));
    }
  }, [searchParams, router]);

  const homeRedirect = localizationHooks.useWithLocale(AppRoutes.Home);

  const { register, handleSubmit, errors } = authHooks.useLoginForm({
    onSuccess: () => {
      const targetUrl =
        returnUrl && routerUtils.isValidRoute(returnUrl)
          ? routerUtils.toRoute(returnUrl)
          : homeRedirect;
      router.replace(targetUrl);
    },
    onError: () => {
      toast.error(t('loginFailed'));
    },
  });

  const { value: isShowPassword, toggleValue: toggleShowPassword } = utils.useBooleanState(false);

  return (
    <form onSubmit={handleSubmit} className='w-full flex flex-col gap-6'>
      <label>
        <span className='text-sm font-medium mb-1 leading-none block'>{t('emailLabel')}</span>
        <FormInput
          {...register('email')}
          type='email'
          placeholder={t('emailPlaceholder')}
          error={errors.email?.message}
        />
      </label>

      <label>
        <span className='text-sm font-medium mb-1 leading-none block'>{t('passwordLabel')}</span>
        <FormInput
          {...register('password')}
          type={isShowPassword ? 'text' : 'password'}
          placeholder={t('passwordPlaceholder')}
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
        {t('button')}
      </Button>
    </form>
  );
}
