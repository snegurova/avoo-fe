'use client';
import React, { useState } from 'react';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import { calendarHooks } from '@avoo/hooks';
import { PrivateCalendarQueryParams } from '@avoo/axios/types/apiTypes';

export default function CalendarPage() {
  /* eslint-disable @typescript-eslint/no-unused-vars */
  const [params, setParams] = useState<PrivateCalendarQueryParams>({
    rangeFromDate: new Date().toISOString(),
    rangeToDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
  });
  const calendar = calendarHooks.useGetCalendar(params);

  return (
    <AppWrapper>
      <div className='p-4 flex justify-between items-center'>
        <h1>Calendar</h1>
        <div className=''></div>
      </div>
      <div className='pb-4'>
        {calendar &&
          calendar.map((schedule) => (
            <div key={`${schedule.userId} ${schedule.masterId || 'common'}`}>{schedule.userId}</div>
          ))}
      </div>
    </AppWrapper>
  );
}
