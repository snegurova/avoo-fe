'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';

import Checkbox from '@mui/material/Checkbox';

import { authHooks } from '@avoo/hooks';
import { utils } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';

import { Button, ButtonFit, ButtonIntent } from '@/_components/Button/Button';
import FormInput from '@/_components/FormInput/FormInput';
import ShowPasswordToggler from '@/_components/ShowPasswordToggler/ShowPasswordToggler';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { useToast } from '@/_hooks/useToast';
import { AppRoutes } from '@/_routes/routes';

export default function RegisterForm() {
  const t = useTranslations('public.signUp.form');
  const isPending = useApiStatusStore((state) => state.isPending);
  const toast = useToast();

  const router = useRouter();
  const homeRedirect = localizationHooks.useWithLocale(AppRoutes.Home);

  const { register, handleSubmit, errors } = authHooks.useRegisterForm({
    onSuccess: () => {
      router.push(homeRedirect);
      toast.success(t('welcomeMessage'));
    },
    onError: () => {
      toast.error(t('registerError'));
    },
  });

  const { value: isShowPassword, toggleValue: toggleShowPassword } = utils.useBooleanState(false);
  const { value: isShowConfirmPassword, toggleValue: toggleConfirmPassword } =
    utils.useBooleanState(false);

  return (
    <form onSubmit={handleSubmit} className='w-full flex flex-col gap-6'>
      <label>
        <span className='text-sm font-medium mb-1 leading-none block'>{t('nameLabel')}</span>
        <FormInput
          {...register('name')}
          type='text'
          placeholder={t('namePlaceholder')}
          error={errors.name?.message}
        />
      </label>
      <label>
        <span className='text-sm font-medium mb-1 leading-none block'>{t('emailLabel')}</span>
        <FormInput
          {...register('email')}
          type='email'
          placeholder={t('emailPlaceholder')}
          error={errors.email?.message}
        />
      </label>

      <label>
        <span className='text-sm font-medium mb-1 leading-none block'>{t('passwordLabel')}</span>
        <FormInput
          {...register('password')}
          type={isShowPassword ? 'text' : 'password'}
          placeholder={t('passwordPlaceholder')}
          error={errors.password?.message}
          accessory={<ShowPasswordToggler value={isShowPassword} toggle={toggleShowPassword} />}
        />
      </label>
      <label>
        <span className='text-sm font-medium mb-1 leading-none block'>
          {t('confirmPasswordLabel')}
        </span>
        <FormInput
          {...register('confirmPassword')}
          type={isShowConfirmPassword ? 'text' : 'password'}
          placeholder={t('confirmPasswordPlaceholder')}
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
          <span className='ml-4 text-xs text-gray-500'>{t('agreeToTerms')}</span>
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
        {t('button')}
      </Button>
    </form>
  );
}
