'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import { authHooks } from '@avoo/hooks';
import { formatHooks } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';

import React, { useEffect } from 'react';
import { Button, ButtonFit, ButtonIntent, ButtonType } from '@/_components/Button/Button';
import CodeInput from '@/_components/CodeInput/CodeInput';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { AppRoutes } from '@/_routes/routes';
import { useToast } from '@/_hooks/useToast';

export default function VerifyCodeForm() {
  const isPending = useApiStatusStore((state) => state.isPending);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  const resetPasswordPath = localizationHooks.useWithLocale(AppRoutes.ResetPassword);
  const forgotPasswordPath = localizationHooks.useWithLocale(AppRoutes.ForgotPassword);
  const toast = useToast();
  const errorMessage = useApiStatusStore((s) => s.errorMessage);
  const isError = useApiStatusStore((s) => s.isError);

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
      router.push(forgotPasswordPath);
    },
  });

  useEffect(() => {
    setValue && setValue('code', code);
  }, [code, setValue]);

  return (
    <div className='w-full flex flex-col gap-6'>
      <p className='text-sm text-gray-500 text-center mb-4'>
        We've sent a 6-digit verification code to your email {maskedEmail}
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
          Verify
        </Button>
      </form>
      <div className='flex justify-center pt-8'>
        <button
          type='button'
          onClick={() => {
            sendCodeHandler({ email });
          }}
          className='hover:text-primary-600 focus:text-primary-600 cursor-pointer'
        >
          Resend code
        </button>
      </div>
    </div>
  );
}
