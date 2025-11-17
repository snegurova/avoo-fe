'use client';

import { useRouter } from 'next/navigation';
import { authHooks } from '@avoo/hooks';
import { Button, ButtonFit, ButtonIntent } from '@/_components/Button/Button';
import FormInput from '@/_components/FormInput/FormInput';
import { routes } from '@/_routes/routes';
import { useApiStore } from '@avoo/store';

export default function ForgotPasswordForm() {
  const isPending = useApiStore((state) => state.isPending);

  const router = useRouter();

  const { sendCodeHandler } = authHooks.useSendCode({
    onSuccess: (email: string) => {
      router.push(`${routes.VerifyCode}?email=${encodeURIComponent(email)}`);
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

