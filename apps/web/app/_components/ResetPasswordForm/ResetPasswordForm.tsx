'use client';

import { useRouter } from 'next/navigation';
import { authHooks } from '@avoo/hooks';
import { Button, ButtonFit, ButtonIntent } from '@/_components/Button/Button';
import FormInput from '@/_components/FormInput/FormInput';
import { routes } from '@/_routes/routes';
import { useApiStatusStore } from '@avoo/store';
import { utils } from '@avoo/hooks';
import ShowPasswordToggler from '@/_components/ShowPasswordToggler/ShowPasswordToggler';


export default function ResetPasswordForm() {
  const isPending = useApiStatusStore((state) => state.isPending);

  const router = useRouter();

  const { register, handleSubmit, errors } = authHooks.useResetPasswordForm({
    onSuccess: () => {
      router.push(routes.SignIn);
    },
  });

  const { value: isShowPassword, toggleValue: toggleShowPassword } = utils.useBooleanState(false);
  const { value: isShowConfirmPassword, toggleValue: toggleConfirmPassword } = utils.useBooleanState(false);

  return (
    <form onSubmit={handleSubmit} className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6'>
      <FormInput
        {...register('password')}
        type={isShowPassword ? 'text' : 'password'}
        placeholder='Password'
        error={errors.password?.message}
        accessory={<ShowPasswordToggler value={isShowPassword} toggle={toggleShowPassword} />}
      />

      <FormInput
        {...register('confirmPassword')}
        type={isShowConfirmPassword ? 'text' : 'password'}
        placeholder='Confirm Password'
        error={errors.confirmPassword?.message}
        accessory={<ShowPasswordToggler value={isShowConfirmPassword} toggle={toggleConfirmPassword} />}
      />

      <Button
        onClick={handleSubmit}
        disabled={isPending}
        loading={isPending}
        fit={ButtonFit.Fill}
        intent={ButtonIntent.Primary}
      >
        Save New Password
      </Button>
    </form>
  );
}

