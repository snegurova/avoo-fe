'use client';

import React, { useEffect } from 'react';
import { useTranslations } from 'next-intl';

import { authHooks } from '@avoo/hooks';
import { utils } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';

import { Button, ButtonFit, ButtonIntent } from '@/_components/Button/Button';
import FormInput from '@/_components/FormInput/FormInput';
import ShowPasswordToggler from '@/_components/ShowPasswordToggler/ShowPasswordToggler';
import { useToast } from '@/_hooks/useToast';

export default function ChangePasswordForm() {
  const tCommon = useTranslations('private.components.ChangePasswordForm.ChangePasswordForm');
  const t = useTranslations('private.profile.changePassword');
  const isPending = useApiStatusStore((state) => state.isPending);
  const toast = useToast();
  const errorMessage = useApiStatusStore((s) => s.errorMessage);
  const isError = useApiStatusStore((s) => s.isError);

  const { register, handleSubmit, errors } = authHooks.useChangePasswordForm({
    onSuccess: () => {
      toast.success('Password changed successfully');
    },
  });

  useEffect(() => {
    if (isError && !!errorMessage) {
      toast.error(errorMessage);
    }
  }, [isError, errorMessage]);

  const { value: isShowOldPassword, toggleValue: toggleShowOldPassword } =
    utils.useBooleanState(false);
  const { value: isShowPassword, toggleValue: toggleShowPassword } = utils.useBooleanState(false);
  const { value: isShowConfirmPassword, toggleValue: toggleConfirmPassword } =
    utils.useBooleanState(false);

  return (
    <div className='md:px-4 pb-4 md:pb-11'>
      <h2 className='font-medium text-xl mb-6'>{tCommon('changePassword')}</h2>
      <form onSubmit={handleSubmit} className='w-full grid lg:grid-cols-2 gap-x-8 gap-y-6 '>
        <label>
          <span className='text-sm font-medium mb-1 leading-none block'>
            {t('oldPasswordLabel')}
          </span>
          <FormInput
            {...register('oldPassword')}
            type={isShowOldPassword ? 'text' : 'password'}
            placeholder={tCommon('currentPassword')}
            error={errors.oldPassword?.message}
            accessory={
              <ShowPasswordToggler value={isShowOldPassword} toggle={toggleShowOldPassword} />
            }
          />
        </label>
        <label>
          <span className='text-sm font-medium mb-1 leading-none block'>
            {t('newPasswordLabel')}
          </span>
          <FormInput
            {...register('password')}
            type={isShowPassword ? 'text' : 'password'}
            placeholder={tCommon('newPassword')}
            error={errors.password?.message}
            accessory={<ShowPasswordToggler value={isShowPassword} toggle={toggleShowPassword} />}
          />
          <p className='text-gray-500 text-xs mt-1'>{t('notation')}</p>
        </label>

        <label>
          <span className='text-sm font-medium mb-1 leading-none block'>
            {t('confirmPasswordLabel')}
          </span>
          <FormInput
            {...register('confirmPassword')}
            type={isShowConfirmPassword ? 'text' : 'password'}
            placeholder={tCommon('confirmPassword')}
            error={errors.confirmPassword?.message}
            accessory={
              <ShowPasswordToggler value={isShowConfirmPassword} toggle={toggleConfirmPassword} />
            }
          />
        </label>

        <div className='col-start-1'>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            loading={isPending}
            fit={ButtonFit.Fill}
            intent={ButtonIntent.Primary}
          >
            {t('saveButton')}
          </Button>
        </div>
      </form>
    </div>
  );
}
