'use client';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Typography } from '@mui/material';

import { messages } from '@avoo/intl/messages/private/calendar/calendar';

import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import Calendar from '@/_components/Calendar/Calendar';

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
