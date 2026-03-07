'use client';

import { Typography } from '@mui/material';

import AppWrapper from '@/_components/AppWrapper/AppWrapper';

import { FormattedMessage } from 'react-intl';
import { messages } from '@avoo/intl/messages/private/profile/profile';

export default function AccountSettingsPage() {
  return (
    <AppWrapper>
      <div className='p-4 flex justify-between items-center'>
        <Typography component='h1' variant='h1'>
          <FormattedMessage {...messages.accountSettings} />
        </Typography>
      </div>
    </AppWrapper>
  );
}
