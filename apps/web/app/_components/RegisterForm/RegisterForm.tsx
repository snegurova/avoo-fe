'use client';

import { useRouter } from 'next/navigation';
import { authHooks } from '@avoo/hooks';
import { Button, ButtonFit, ButtonIntent } from '@/_components/Button/Button';
import FormInput from '@/_components/FormInput/FormInput';
import { AppRoutes } from '@/_routes/routes';
import { useApiStatusStore } from '@avoo/store';
import { utils } from '@avoo/hooks';
import ShowPasswordToggler from '@/_components/ShowPasswordToggler/ShowPasswordToggler';
import { localizationHooks } from '@/_hooks/localizationHooks';
import Checkbox from '@mui/material/Checkbox';

export default function RegisterForm() {
  const isPending = useApiStatusStore((state) => state.isPending);

  const router = useRouter();

  const { register, handleSubmit, errors } = authHooks.useRegisterForm({
    onSuccess: () => {
      router.push(localizationHooks.useWithLocale(AppRoutes.Home));
    },
  });

  const { value: isShowPassword, toggleValue: toggleShowPassword } = utils.useBooleanState(false);
  const { value: isShowConfirmPassword, toggleValue: toggleConfirmPassword } =
    utils.useBooleanState(false);

  return (
    <form onSubmit={handleSubmit} className='w-full flex flex-col gap-6'>
      <label>
        <span className='text-sm font-medium mb-1 leading-none block'>Full Name *</span>
        <FormInput
          {...register('name')}
          type='text'
          placeholder='Full Name'
          error={errors.name?.message}
        />
      </label>
      <label>
        <span className='text-sm font-medium mb-1 leading-none block'>Email address *</span>
        <FormInput
          {...register('email')}
          type='email'
          placeholder='Email'
          error={errors.email?.message}
        />
      </label>

      <label>
        <span className='text-sm font-medium mb-1 leading-none block'>Password *</span>
        <FormInput
          {...register('password')}
          type={isShowPassword ? 'text' : 'password'}
          placeholder='Password'
          error={errors.password?.message}
          accessory={<ShowPasswordToggler value={isShowPassword} toggle={toggleShowPassword} />}
        />
      </label>
      <label>
        <span className='text-sm font-medium mb-1 leading-none block'>Confirm Password *</span>
        <FormInput
          {...register('confirmPassword')}
          type={isShowConfirmPassword ? 'text' : 'password'}
          placeholder='Confirm Password'
          error={errors.confirmPassword?.message}
          accessory={
            <ShowPasswordToggler value={isShowConfirmPassword} toggle={toggleConfirmPassword} />
          }
        />
      </label>
      <div>
        <label className='flex items-center cursor-pointer'>
          <Checkbox
            {...register('agreeToTerms')}
            onChange={() => {}}
            size='medium'
            sx={{
              p: 0,
              height: 20,
              width: 20,
              color: 'var(--color-gray-700)',
              '&.Mui-checked': {
                color: 'var(--color-gray-700)',
              },
            }}
          />
          <span className='ml-4 text-xs text-gray-500'>
            I agree to the Privacy Policy, Terms of Service and Terms of Business.
          </span>
        </label>
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
