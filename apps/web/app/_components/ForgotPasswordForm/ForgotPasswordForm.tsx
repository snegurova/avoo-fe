'use client';

import { useRouter } from 'next/navigation';
import { authHooks } from '@avoo/hooks';
import { Button, ButtonFit, ButtonIntent } from '@/_components/Button/Button';
import FormInput from '@/_components/FormInput/FormInput';
import { appRoutes } from '@/_routes/routes';
import { useApiStatusStore } from '@avoo/store';

export default function ForgotPasswordForm() {
  const isPending = useApiStatusStore((state) => state.isPending);

  const router = useRouter();

  const { sendCodeHandler } = authHooks.useSendCode({
    onSuccess: (email: string) => {
      router.push(`${appRoutes.VerifyCode}?email=${encodeURIComponent(email)}`);
    },
  });

  const { register, handleSubmit, errors } = authHooks.useForgotPasswordForm({
    sendCodeHandler,
  });

  return (
    <form onSubmit={handleSubmit} className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6'>
      <FormInput
        {...register('email')}
        type='email'
        placeholder='Email'
        error={errors.email?.message}
        autoCapitalize='none'
      />
      <Button
        onClick={handleSubmit}
        disabled={isPending}
        loading={isPending}
        fit={ButtonFit.Fill}
        intent={ButtonIntent.Primary}
      >
        Send Code
      </Button>
    </form>
  );
}
