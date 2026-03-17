'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

import { Typography } from '@mui/material';

import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import Calendar from '@/_components/Calendar/Calendar';

export default function CalendarPage() {
  const t = useTranslations('private.calendar.calendar');
  return (
    <AppWrapper>
      <div className='p-4 flex justify-between items-center'>
        <Typography component='h1' variant='h1'>
          {t('title')}
        </Typography>
      </div>
      <Calendar />
    </AppWrapper>
  );
}
