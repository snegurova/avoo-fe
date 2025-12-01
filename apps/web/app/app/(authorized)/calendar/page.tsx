'use client';
import React from 'react';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';

export default function CalendarPage() {
  return (
    <AppWrapper>
      <div className='p-4 flex justify-between items-center'>
        <h1>Calendar</h1>
        <div className=''></div>
      </div>
      <div className='pb-4'>Calendar content</div>
    </AppWrapper>
  );
}
