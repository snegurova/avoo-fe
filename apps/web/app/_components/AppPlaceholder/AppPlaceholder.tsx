import React from 'react';
import CalendarEventIcon from '@/_icons/CalendarIcon';

export default function AppPlaceholder() {
  return (
    <div className='flex justify-center items-center flex-col grow h-full gap-8'>
      <div className='rounded-full w-30 h-30 lg:w-37.5 lg:h-37.5 bg-primary-50 flex items-center justify-center'>
        <CalendarEventIcon className='w-20 h-20 lg:w-25 lg:h-25 fill-primary-300' />
      </div>
      <div className='max-w-62 md:max-w-90 flex flex-col gap-3 items-center'>
        <h3 className='text-xl md:text-2xl font-medium text-center'>No schedules</h3>
        <p className='text-center text-gray-500 text-xs'>
          There are currently no schedules to display. Choose masters to see their schedules here.
        </p>
      </div>
    </div>
  );
}
