'use client';
import React from 'react';

import { Typography } from '@mui/material';

import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import Calendar from '@/_components/Calendar/Calendar';

export default function CalendarPage() {
  return (
    <AppWrapper>
      <div className='p-4 flex justify-between items-center'>
        <Typography component='h1' variant='h1'>
          Calendar
        </Typography>
      </div>
      <Calendar />
    </AppWrapper>
  );
}
