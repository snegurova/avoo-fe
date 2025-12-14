import React from 'react';
import { calendarViewType } from '@avoo/hooks/types/calendarViewType';
import { timeUtils } from '@/_utils/timeUtils';
import CalendarCurrentTime from '../CalendarCurrentTime/CalendarCurrentTime';
import { tv } from 'tailwind-variants';

type Props = {
  type: calendarViewType;
  date: Date;
};

const container = tv({
  base: 'shrink-0 sticky bg-white z-7',
  variants: {
    type: {
      [calendarViewType.DAY]: 'left-0 w-10.5',
      [calendarViewType.WEEK]: 'top-0 min-w-full h-10 flex flex-row flex-nowrap',
      [calendarViewType.MONTH]: 'top-0 min-w-full h-10 flex flex-row flex-nowrap',
    },
  },
});

export default function CalendarTimeScale(props: Props) {
  const { type, date } = props;

  const weekRange = timeUtils.getWeekRange(date);

  return (
    <div className={container({ type })}>
      {type === calendarViewType.DAY && (
        <>
          {Array.from({ length: 24 }).map((_, idx) => (
            <div
              key={type + idx}
              className='h-24 p-1 last:border-b border-t border-border3 text-xs text-time font-medium box-border border-r leading-'
            >
              {idx}:00
            </div>
          ))}
          {timeUtils.isSameDay(date, new Date()) && <CalendarCurrentTime showLabel />}
        </>
      )}
      {(type === calendarViewType.WEEK || type === calendarViewType.MONTH) &&
        Array.from({ length: 7 }).map((_, idx) => (
          <div
            key={type + idx}
            className='h-full p-1 not-last:border-r border-border3 text-xs text-time font-medium box-border border-b flex items-center justify-center flex-1 min-w-40'
          >
            {type === calendarViewType.WEEK && <>{weekRange.start.getDate() + idx}, </>}
            {timeUtils.getWeekDay(idx)}
          </div>
        ))}
    </div>
  );
}
