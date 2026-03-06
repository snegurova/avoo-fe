'use client';
import React from 'react';

import { Typography } from '@mui/material';

import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import Calendar from '@/_components/Calendar/Calendar';
import { FormattedMessage } from 'react-intl';
import { messages } from '@avoo/intl/messages/private/calendar/calendar';

export default function CalendarPage() {
  return (
    <AppWrapper>
      <div className='p-4 flex justify-between items-center'>
        <Typography component='h1' variant='h1'>
          <FormattedMessage {...messages.title} />
        </Typography>
      </div>
      <Calendar />
    </AppWrapper>
  );
}
