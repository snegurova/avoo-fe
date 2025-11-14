'use client';

import { useRouter } from 'next/navigation';
import { authHooks } from '@avoo/hooks';
import { Button, ButtonFit, ButtonIntent } from '../Button/Button';
import { memo } from 'react';
import FormInput from '../FormInput/FormInput';
import { routes } from '../../_routes/routes';
import { useApiStore } from 'packages/store/src/api.store';
import { utils } from 'packages/hooks/utils/utils';


const AccessoryRight = memo(({ value, toggle }: { value: boolean; toggle: () => void }) => {
  return (
    <button type='button' onClick={toggle}>
      {value ? <p>👁️</p> : <p>🫣</p>}
    </button>
  );
});

AccessoryRight.displayName = 'AccessoryRight';

export default function ResetPasswordForm() {
  const isPending = useApiStore((state) => state.isPending);

  const router = useRouter();

  const { register, handleSubmit, errors } = authHooks.useResetPasswordForm({
    onSuccess: () => {
      router.push(routes.SignIn);
    },
  });

  const { value: isShowPassword, toggle } = utils.useBoolean(false);
  const { value: isShowConfirmPassword, toggle: toggleConfirmPassword } = utils.useBoolean(false);

  return (
    <form onSubmit={handleSubmit} className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6'>
      <FormInput
        {...register('password')}
        type={isShowPassword ? 'text' : 'password'}
        placeholder='Password'
        error={errors.password?.message}
        accessoryRight={
          <AccessoryRight value={isShowPassword} toggle={toggle} />
        }
      />

      <FormInput
        {...register('confirmPassword')}
        type={isShowConfirmPassword ? 'text' : 'password'}
        placeholder='Confirm Password'
        error={errors.confirmPassword?.message}
        accessoryRight={
          <AccessoryRight value={isShowConfirmPassword} toggle={toggleConfirmPassword} />
        }
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




