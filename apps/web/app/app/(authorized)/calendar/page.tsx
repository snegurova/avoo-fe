'use client';
import React from 'react';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import { Typography } from '@mui/material';
import Calendar from '@/_components/Calendar/Calendar';

export default function CalendarPage() {
  return (
    <AppWrapper>
      <div className='p-4 flex justify-between items-center'>
        <Typography component='h1'>Calendar</Typography>
        <div className=''></div>
      </div>
      <Calendar />
    </AppWrapper>
  );
}
