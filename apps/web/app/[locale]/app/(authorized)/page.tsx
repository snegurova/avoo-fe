'use client';
import { useTranslations } from 'next-intl';

import { Typography } from '@mui/material';

import { CalendarType } from '@avoo/hooks/types/calendarType';

import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import Calendar from '@/_components/Calendar/Calendar';
import NewOrdersWidget from '@/_components/NewOrdersWidget/NewOrdersWidget';
import NextAppointmentsWidget from '@/_components/NextAppointmentsWidget/NextAppointmentsWidget';

export default function DashboardPage() {
  const t = useTranslations('private.calendar.calendar');
  const navT = useTranslations('private.navigation.navigation');
  return (
    <div className='flex min-w-0 flex-col gap-8 h-full w-full lg:grid lg:grid-cols-3'>
      <AppWrapper className='order-2 min-w-0 lg:col-span-2 lg:order-1'>
        <div className='p-4 flex justify-between items-center'>
          <Typography component='h1' variant='h1'>
            {t('title')}
          </Typography>
        </div>
        <Calendar calendarType={CalendarType.WIDGET} />
      </AppWrapper>
      <div className='order-1 flex min-w-0 flex-col gap-8 lg:order-2'>
        <div className='min-w-0'>
          <AppWrapper isWidget className='min-w-0'>
            <div className='p-4 flex justify-between items-center'>
              <Typography component='h1' variant='h1'>
                {navT('newOrders')}
              </Typography>
            </div>
            <NewOrdersWidget />
          </AppWrapper>
        </div>
        <div className='min-w-0'>
          <AppWrapper isWidget className='min-w-0'>
            <div className='p-4 flex justify-between items-center'>
              <Typography component='h1' variant='h1'>
                {navT('nextAppointments')}
              </Typography>
            </div>
            <NextAppointmentsWidget />
          </AppWrapper>
        </div>
      </div>
    </div>
  );
}
