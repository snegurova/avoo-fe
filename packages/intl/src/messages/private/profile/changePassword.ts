import { defineMessages } from 'react-intl';

export const messages = defineMessages({
  oldPasswordLabel: {
    id: 'private.profile.changePassword.oldPasswordLabel',
    defaultMessage: 'Current password *',
  },
  newPasswordLabel: {
    id: 'private.profile.changePassword.newPasswordLabel',
    defaultMessage: 'New password *',
  },
  confirmPasswordLabel: {
    id: 'private.profile.changePassword.confirmPasswordLabel',
    defaultMessage: 'Confirm new password *',
  },
  notation: {
    id: 'private.profile.changePassword.notation',
    defaultMessage: 'Use at least 8 characters, including a number and a symbol.',
  },
  saveButton: {
    id: 'private.profile.changePassword.saveButton',
    defaultMessage: 'Save changes',
  },
});
