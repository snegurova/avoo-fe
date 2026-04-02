import React, { forwardRef } from 'react';

import { tv } from 'tailwind-variants';

import { timeUtils } from '@avoo/shared';

import { PX_IN_MINUTE } from '@/_constants/time';
import SearchActivity from '@/_icons/SearchActivity';

type Props = {
  index: number;
  title: string | null;
  date: string;
  duration: number;
};

const slot = tv({
  base: 'flex  gap-1 pointer-events-none border rounded-[3px] overflow-hidden h-full relative w-full cursor-pointer transition-colors border-green-800 bg-green-200 text-green-800 p-1 font-medium order-item',
  variants: {
    small: {
      true: '',
      false: 'flex-col',
    },
  },
});

const CalendarSlot = forwardRef<HTMLDivElement, Props>(function CalendarSlot(props, ref) {
  const { index, title, date, duration } = props;

  return (
    <div
      ref={ref}
      className='z-6 absolute left-0 right-0 p-0.5 pointer order-wrapper'
      style={{
        top: `${timeUtils.getMinutesInDay(date) * PX_IN_MINUTE}px`,
        height: `${duration * PX_IN_MINUTE}px`,
      }}
    >
      <div className={slot({ small: duration < 30 })}>
        <div className='flex gap-1'>
          <SearchActivity className='w-3 h-3 shrink-0 fill-green-800' />

          <span className='text-xs font-medium text-inherit text-start leading-[1.15]'>
            {timeUtils.getTime(date)}
          </span>
        </div>
        <h3 className='text-xs font-inherit text-inherit leading-[1.15] text-start  pointer-events-none'>
          {title || `Service ${index + 1}`}
        </h3>
      </div>
    </div>
  );
});

export default CalendarSlot;
