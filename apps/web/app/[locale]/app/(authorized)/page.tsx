'use client';
import { FormattedMessage } from 'react-intl';

import { Typography } from '@mui/material';

import { CalendarType } from '@avoo/hooks/types/calendarType';
import { messages } from '@avoo/intl/messages/private/calendar/calendar';
import { messages as navMessages } from '@avoo/intl/messages/private/navigation/navigation';

import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import Calendar from '@/_components/Calendar/Calendar';

export default function DashboardPage() {
  return (
    <div className='flex flex-col lg:grid lg:grid-cols-3 gap-8 w-full h-full'>
      <AppWrapper className='lg:col-span-2 order-2 lg:order-1'>
        <div className='p-4 flex justify-between items-center'>
          <Typography component='h1' variant='h1'>
            <FormattedMessage {...messages.title} />
          </Typography>
        </div>
        <Calendar calendarType={CalendarType.WIDGET} />
      </AppWrapper>
      <div className='flex flex-col md:flex-row lg:flex-col gap-8 order-1 lg:order-2'>
        <div className='md:flex-1 lg:flex-none'>
          <AppWrapper isWidget>
            <div className='p-4 flex justify-between items-center'>
              <Typography component='h1' variant='h1'>
                <FormattedMessage {...navMessages.newNotifications} />
              </Typography>
            </div>
          </AppWrapper>
        </div>
        <div className='md:flex-1 lg:flex-none'>
          <AppWrapper isWidget>
            <div className='p-4 flex justify-between items-center'>
              <Typography component='h1' variant='h1'>
                <FormattedMessage {...navMessages.nextAppointments} />
              </Typography>
            </div>
          </AppWrapper>
        </div>
      </div>
    </div>
  );
}
