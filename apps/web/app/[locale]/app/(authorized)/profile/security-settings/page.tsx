'use client';

import { FormattedMessage } from 'react-intl';

import { messages } from '@avoo/intl/messages/private/profile/profile';

import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import ChangePasswordForm from '@/_components/ChangePasswordForm/ChangePasswordForm';

export default function SecuritySettingsPage() {
  return (
    <AppWrapper withPadding>
      <div className='md:px-4 pb-4 mb-6'>
        <h1 className='text-xl md:text-2xl font-medium tracking-wider'>
          <FormattedMessage {...messages.securitySettings} />
        </h1>
      </div>
      <ChangePasswordForm />
    </AppWrapper>
  );
}
