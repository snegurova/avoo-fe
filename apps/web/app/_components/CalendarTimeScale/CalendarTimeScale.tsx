import React from 'react';
import { calendarViewType } from '@avoo/hooks/types/calendarViewType';

type Props = {
  type: calendarViewType;
};

export default function CalendarTimeScale(props: Props) {
  const { type } = props;

  return (
    <div className='w-10.5 shrink-0 sticky left-0 bg-white'>
      {type === calendarViewType.DAY &&
        Array.from({ length: 24 }).map((_, idx) => (
          <div
            key={type + idx}
            className='h-24 p-1 last:border-b border-t border-border3 text-xs text-time font-medium box-border border-r leading-'
          >
            {idx}:00
          </div>
        ))}
      {type === calendarViewType.WEEK &&
        Array.from({ length: 7 }).map((_, idx) => (
          <div
            key={type + idx}
            className='h-24 p-1 last:border-b border-t border-border3 text-xs text-time font-medium box-border border-r'
          >
            {idx + 1} Day
          </div>
        ))}
      {type === calendarViewType.MONTH &&
        Array.from({ length: 31 }).map((_, idx) => (
          <div
            key={type + idx}
            className='h-24 p-1 last:border-b border-t border-border3 text-xs text-time font-medium box-border border-r'
          >
            {idx + 1}
          </div>
        ))}
    </div>
  );
}
