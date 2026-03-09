import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  title: {
    id: 'public.resetPassword.page.title',
    defaultMessage: 'Create a new password',
  },
  description: {
    id: 'public.resetPassword.page.description',
    defaultMessage: 'Choose a strong password to keep your account secure.',
  },
  newPasswordLabel: {
    id: 'public.resetPassword.page.newPasswordLabel',
    defaultMessage: 'New password *',
  },
  confirmPasswordLabel: {
    id: 'public.resetPassword.page.confirmPasswordLabel',
    defaultMessage: 'Confirm password *',
  },
  saveButton: {
    id: 'public.resetPassword.page.saveButton',
    defaultMessage: 'Save new password',
  },
  notation: {
    id: 'public.resetPassword.page.notation',
    defaultMessage: 'Use at least 8 characters, including a number and a symbol.',
  },
});
