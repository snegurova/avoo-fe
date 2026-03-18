'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { authHooks } from '@avoo/hooks';
import { formatHooks } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';

import { Button, ButtonFit, ButtonIntent, ButtonType } from '@/_components/Button/Button';
import CodeInput from '@/_components/CodeInput/CodeInput';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { useToast } from '@/_hooks/useToast';
import { AppRoutes } from '@/_routes/routes';

export default function VerifyCodeForm() {
  const t = useTranslations('private.components.VerifyCodeForm.VerifyCodeForm');
  const isPending = useApiStatusStore((state) => state.isPending);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const resetPasswordPath = localizationHooks.useWithLocale(AppRoutes.ResetPassword);
  const toast = useToast();
  const errorMessage = useApiStatusStore((s) => s.errorMessage);
  const isError = useApiStatusStore((s) => s.isError);
  const { logoutMutation } = authHooks.useLogout();

  const maskedEmail = formatHooks.useMaskEmail(email);

  const { sendCodeHandler } = authHooks.useSendCode();

  const [code, setCode] = React.useState('');

  useEffect(() => {
    if (isError && !!errorMessage) {
      toast.error(errorMessage);
    }
  }, [isError, errorMessage]);

  const { handleSubmit, errors, register, setValue } = authHooks.useVerifyCodeForm({
    email,
    onSuccess: () => {
      router.push(resetPasswordPath);
    },
    onError: () => {
      toast.error(t('invalidCode'));
      logoutMutation();
    },
  });

  useEffect(() => {
    if (setValue) {
      setValue('code', code);
    }
  }, [code, setValue]);

  const resendCode = async () => {
    try {
      sendCodeHandler({ email });
      toast.success(t('resendSuccess'));
    } catch {
      toast.error(t('resendError'));
    }
  };

  return (
    <div className='w-full flex flex-col gap-6'>
      <p className='text-sm text-gray-500 text-center mb-4'>
        {t('codeSentTo', { email: maskedEmail })}
      </p>
      <form onSubmit={handleSubmit} className='space-y-6 pb-6 pt-8'>
        <CodeInput
          value={code}
          onChange={(val) => setCode(val.slice(0, 6))}
          length={6}
          disabled={isPending}
        />
        <input type='hidden' name='code' ref={register('code').ref} value={code} readOnly />
        {errors.code?.message && (
          <div className='text-red-500 text-xs text-center'>{errors.code.message}</div>
        )}
        <Button
          type={ButtonType.Submit}
          disabled={isPending || code.length !== 6}
          loading={isPending}
          fit={ButtonFit.Fill}
          intent={ButtonIntent.Primary}
        >
          {t('verify')}
        </Button>
      </form>
      <div className='flex justify-center pt-8'>
        <button
          type='button'
          onClick={resendCode}
          className='hover:text-primary-600 focus:text-primary-600 cursor-pointer'
        >
          {t('resendCode')}
        </button>
      </div>
    </div>
  );
}
