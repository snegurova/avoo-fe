'use client';

import { useRouter } from 'next/navigation';
import { authHooks } from '@avoo/hooks';
import { Button, ButtonFit, ButtonIntent } from '@/_components/Button/Button';
import FormInput from '@/_components/FormInput/FormInput';
import { appRoutes } from '@/_routes/routes';
import { useApiStatusStore } from '@avoo/store';
import { utils } from '@avoo/hooks';
import ShowPasswordToggler from '@/_components/ShowPasswordToggler/ShowPasswordToggler';

export default function RegisterForm() {
  const isPending = useApiStatusStore((state) => state.isPending);

  const router = useRouter();

  const { register, handleSubmit, errors } = authHooks.useRegisterForm({
    onSuccess: () => {
      router.push(appRoutes.Home);
    },
  });

  const { value: isShowPassword, toggleValue: toggleShowPassword } = utils.useBooleanState(false);
  const { value: isShowConfirmPassword, toggleValue: toggleConfirmPassword } =
    utils.useBooleanState(false);

  return (
    <form onSubmit={handleSubmit} className='mt-10 sm:mx-auto sm:w-full sm:max-w-sm space-y-6'>
      <FormInput
        {...register('name')}
        type='text'
        placeholder='Full Name'
        error={errors.name?.message}
      />

      <FormInput
        {...register('email')}
        type='email'
        placeholder='Email'
        error={errors.email?.message}
      />

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
        accessory={
          <ShowPasswordToggler value={isShowConfirmPassword} toggle={toggleConfirmPassword} />
        }
      />

      <div>
        <div className='flex items-start'>
          <div className='flex items-center h-5'>
            <input
              {...register('agreeToTerms')}
              type='checkbox'
              className='w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300'
            />
          </div>
          <label className='ml-2 text-sm text-gray-600'>
            I agree to the Privacy Policy, Terms of Service and Terms of Business.
          </label>
        </div>
        {errors.agreeToTerms && (
          <p className='mt-1 text-sm text-red-500'>{errors.agreeToTerms.message}</p>
        )}
      </div>

      <Button
        onClick={handleSubmit}
        disabled={isPending}
        loading={isPending}
        fit={ButtonFit.Fill}
        intent={ButtonIntent.Primary}
      >
        Create Account
      </Button>
    </form>
  );
}
