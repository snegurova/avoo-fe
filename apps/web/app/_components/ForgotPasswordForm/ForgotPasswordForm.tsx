'use client';

import { useRouter } from 'next/navigation';
import { authHooks } from '@avoo/hooks';
import { Button, ButtonFit, ButtonIntent } from '@/_components/Button/Button';
import FormInput from '@/_components/FormInput/FormInput';
import { AppRoutes } from '@/_routes/routes';
import { useApiStatusStore } from '@avoo/store';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { FormattedMessage } from 'react-intl';
import { messages } from '@avoo/intl/messages/public/forgotPassword/page';

export default function ForgotPasswordForm() {
  const isPending = useApiStatusStore((state) => state.isPending);

  const router = useRouter();

  const { sendCodeHandler } = authHooks.useSendCode({
    onSuccess: (email: string) => {
      router.push(
        `${localizationHooks.useWithLocale(AppRoutes.VerifyCode)}?email=${encodeURIComponent(email)}`,
      );
    },
  });

  const { register, handleSubmit, errors } = authHooks.useForgotPasswordForm({
    sendCodeHandler,
  });

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
