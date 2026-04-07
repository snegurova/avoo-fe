'use client';
import React from 'react';
import { useTranslations } from 'next-intl';

import { Switch, Typography } from '@mui/material';

import { useCalendarStore } from '@avoo/store';

import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import OrderCreate from '@/_components/OrderCreate/OrderCreate';

export default function CreateOrderPage() {
  const t = useTranslations('private.orders.create');
  const workingTimeOnly = useCalendarStore((state) => state.workingTimeOnly);
  const setWorkingTimeOnly = useCalendarStore((state) => state.setWorkingTimeOnly);

  return (
    <AppWrapper>
      <div className='px-4 lg:pr-30 py-3 flex gap-4 items-center justify-between'>
        <Typography component='h1' variant='h1'>
          {t('title')}
        </Typography>
        <div className='flex justify-end items-center gap-2'>
          <Typography variant='body2'>
            {workingTimeOnly ? t('workingTimeOnly') : t('anyTime')}
          </Typography>
          <Switch
            checked={workingTimeOnly}
            onChange={(_, checked) => setWorkingTimeOnly(checked)}
          />
        </div>
      </div>
      <OrderCreate />
    </AppWrapper>
  );
}
