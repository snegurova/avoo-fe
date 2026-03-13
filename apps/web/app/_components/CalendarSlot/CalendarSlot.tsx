import React from 'react';

import { timeUtils } from '@avoo/shared';

import { PX_IN_MINUTE } from '@/_constants/time';
import SearchActivity from '@/_icons/SearchActivity';

type Props = {
  index: number;
  title: string | null;
  masterId: number | null;
  date: string;
  duration: number;
};

export default function CalendarSlot(props: Props) {
  const { index, title, masterId, date, duration } = props;

  return (
    <div
      className='z-6 absolute left-0 right-0 p-0.5 pointer order-wrapper border-orange-500 bg-orange-50 text-orange-700 opacity-80'
      style={{
        top: `${timeUtils.getMinutesInDay(date) * PX_IN_MINUTE}px`,
        height: `${duration * PX_IN_MINUTE}px`,
      }}
    >
      <div className='flex gap-1 pointer-events-none border rounded-[3px] overflow-hidden h-full relative w-full cursor-pointer transition-colors border-orange-500 bg-orange-50 text-orange-700 p-1 font-medium order-item'>
        <SearchActivity className='w-3 h-3 shrink-0 fill-orange-500' />

        <span className='text-xs font-medium text-inherit text-start leading-[1.15]'>
          {timeUtils.getTime(date)}
        </span>

        <h3 className='text-xs font-inherit text-inherit leading-[1.15] text-start  pointer-events-none'>
          {title || `Service ${index + 1}`}
        </h3>
      </div>
    </div>
  );
}
