'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { authHooks } from '@avoo/hooks';
import { Button, ButtonFit, ButtonIntent } from '../Button/Button';
import FormInput from '../FormInput/FormInput';
import { routes } from '../../_routes/routes';
import { useApiStore } from 'packages/store/src/api.store';
import formatHooks from 'packages/hooks/src/formatHooks';

export default function VerifyCodeForm() {
  const isPending = useApiStore((state) => state.isPending);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  const maskedEmail = formatHooks.useMaskEmail(email);

  const { sendCodeHandler } = authHooks.useSendCode();

  const { register, handleSubmit, errors } = authHooks.useVerifyCodeForm({
    email: email || '',
    onSuccess: () => {
      router.push(routes.ResetPassword);
    },
  });

  return (
    <div className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6'>
      <p className='text-sm text-gray-500 text-center mb-4'>
        We've sent a 6-digit verification code to your email {maskedEmail}
      </p>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <FormInput
          {...register('code')}
          type='text'
          placeholder='Enter 6-digit code'
          error={errors.code?.message}
          maxLength={6}
          inputMode='numeric'
          pattern='[0-9]*'
        />
        <Button
          onClick={handleSubmit}
          disabled={isPending}
          loading={isPending}
          fit={ButtonFit.Fill}
          intent={ButtonIntent.Primary}
        >
          Verify
        </Button>
      </form>
      <button
        type='button'
        onClick={() => {
          sendCodeHandler({ email });
        }}
        className='text-sm text-blue-500 hover:underline text-center w-full'
      >
        Resend code
      </button>
    </div>
  );
}

