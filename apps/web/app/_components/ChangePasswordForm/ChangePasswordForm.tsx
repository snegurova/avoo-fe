'use client';

import React from 'react';
import { FormattedMessage } from 'react-intl';

import { authHooks } from '@avoo/hooks';
import { utils } from '@avoo/hooks';
import { messages } from '@avoo/intl/messages/private/profile/changePassword';
import { useApiStatusStore } from '@avoo/store';

import { Button, ButtonFit, ButtonIntent } from '@/_components/Button/Button';
import FormInput from '@/_components/FormInput/FormInput';
import ShowPasswordToggler from '@/_components/ShowPasswordToggler/ShowPasswordToggler';

export default function ChangePasswordForm() {
  const isPending = useApiStatusStore((state) => state.isPending);

  const { register, handleSubmit, errors } = authHooks.useChangePasswordForm();

  const { value: isShowOldPassword, toggleValue: toggleShowOldPassword } =
    utils.useBooleanState(false);
  const { value: isShowPassword, toggleValue: toggleShowPassword } = utils.useBooleanState(false);
  const { value: isShowConfirmPassword, toggleValue: toggleConfirmPassword } =
    utils.useBooleanState(false);

  return (
    <form onSubmit={handleSubmit} className='w-full flex flex-col gap-6'>
      <label>
        <span className='text-sm font-medium mb-1 leading-none block'>
          <FormattedMessage {...messages.oldPasswordLabel} />
        </span>
        <FormInput
          {...register('oldPassword')}
          type={isShowOldPassword ? 'text' : 'password'}
          placeholder='Current password'
          error={errors.oldPassword?.message}
          accessory={
            <ShowPasswordToggler value={isShowOldPassword} toggle={toggleShowOldPassword} />
          }
        />
      </label>
      <label>
        <span className='text-sm font-medium mb-1 leading-none block'>
          <FormattedMessage {...messages.newPasswordLabel} />
        </span>
        <FormInput
          {...register('password')}
          type={isShowPassword ? 'text' : 'password'}
          placeholder='New password'
          error={errors.password?.message}
          accessory={<ShowPasswordToggler value={isShowPassword} toggle={toggleShowPassword} />}
        />
        <p className='text-gray-500 text-xs mt-1'>
          <FormattedMessage {...messages.notation} />
        </p>
      </label>

      <label>
        <span className='text-sm font-medium mb-1 leading-none block'>
          <FormattedMessage {...messages.confirmPasswordLabel} />
        </span>
        <FormInput
          {...register('confirmPassword')}
          type={isShowConfirmPassword ? 'text' : 'password'}
          placeholder='Confirm password'
          error={errors.confirmPassword?.message}
          accessory={
            <ShowPasswordToggler value={isShowConfirmPassword} toggle={toggleConfirmPassword} />
          }
        />
      </label>

      <Button
        onClick={handleSubmit}
        disabled={isPending}
        loading={isPending}
        fit={ButtonFit.Fill}
        intent={ButtonIntent.Primary}
      >
        <FormattedMessage {...messages.saveButton} />
      </Button>
    </form>
  );
}
