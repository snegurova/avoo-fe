'use client';

import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { useRouter } from 'next/navigation';

import { authHooks } from '@avoo/hooks';
import { messages } from '@avoo/intl/messages/public/forgotPassword/page';
import { useApiStatusStore } from '@avoo/store';

import { Button, ButtonFit, ButtonIntent } from '@/_components/Button/Button';
import FormInput from '@/_components/FormInput/FormInput';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { useToast } from '@/_hooks/useToast';
import { AppRoutes } from '@/_routes/routes';

export default function ForgotPasswordForm() {
  const isPending = useApiStatusStore((state) => state.isPending);

  const router = useRouter();
  const toast = useToast();
  const errorMessage = useApiStatusStore((s) => s.errorMessage);
  const isError = useApiStatusStore((s) => s.isError);
  const verifyCodePath = localizationHooks.useWithLocale(AppRoutes.VerifyCode);

  const { sendCodeHandler } = authHooks.useSendCode({
    onSuccess: (email: string) => {
      toast.success('Verification code sent to your email');
      router.push(`${verifyCodePath}?email=${encodeURIComponent(email)}`);
    },
  });

  const { register, handleSubmit, errors } = authHooks.useForgotPasswordForm({
    sendCodeHandler,
  });

  useEffect(() => {
    if (isError && !!errorMessage) {
      toast.error(errorMessage);
    }
  }, [isError, errorMessage]);

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
          autoCapitalize='none'
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
