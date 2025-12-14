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

const dateValue = tv({
  base: 'w-8 h-8 flex items-center justify-center font-medium',
  variants: {
    day: {
      today: 'rounded-full text-white bg-primary-800',
      past: '',
      future: '',
    },
  },
});

const weekDay = tv({
  base: 'h-full p-1 not-last:border-r border-gray-300 text-xs font-medium box-border border-b flex items-center justify-center flex-1 min-w-40 gap-1',
  variants: {
    day: {
      today: 'text-primary-800',
      past: 'text-gray-500',
      future: 'text-black',
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
              className='h-24 p-1 last:border-b border-t border-gray-300 text-xs text-black font-medium box-border border-r leading-'
            >
              {idx}:00
            </div>
          ))}
          {timeUtils.isSameDay(date, new Date()) && <CalendarCurrentTime showLabel />}
        </>
      )}
      {(type === calendarViewType.WEEK || type === calendarViewType.MONTH) &&
        Array.from({ length: 7 }).map((_, idx) => {
          const dateObj = new Date(weekRange.start.getTime() + idx * 24 * 60 * 60 * 1000);

          let day: 'future' | 'today' | 'past' = 'future';
          if (timeUtils.isSameDay(dateObj, new Date())) {
            day = 'today';
          } else if (dateObj < timeUtils.toDayBegin(new Date())) {
            day = 'past';
          }

          return (
            <div key={type + idx} className={weekDay({ day })}>
              {type === calendarViewType.WEEK && (
                <span
                  className={dateValue({
                    day,
                  })}
                >
                  {weekRange.start.getDate() + idx}
                </span>
              )}
              {timeUtils.getWeekDay(idx)}
            </div>
          );
        })}
    </div>
  );
}
