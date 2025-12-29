import React from 'react';
import { calendarViewType } from '@avoo/hooks/types/calendarViewType';
import { timeUtils } from '@/_utils/timeUtils';
import CalendarCurrentTime from '../CalendarCurrentTime/CalendarCurrentTime';
import { tv } from 'tailwind-variants';
import useMediaQuery from '@mui/material/useMediaQuery';

type Props = {
  type: calendarViewType;
  date: Date;
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
};

const container = tv({
  base: 'shrink-0 sticky bg-white z-7',
  variants: {
    type: {
      [calendarViewType.DAY]: 'left-0 w-10.5',
      [calendarViewType.WEEK]: 'top-0 min-w-full h-10 flex flex-row flex-nowrap',
      [calendarViewType.MONTH]: 'top-0 h-10 grid grid-cols-7 min-w-70',
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
  base: 'h-full p-1 not-last:border-r border-gray-300 text-xs font-medium box-border border-b flex items-center justify-center flex-1 gap-1',
  variants: {
    type: {
      [calendarViewType.WEEK]: 'min-w-26 md:min-w-40',
      [calendarViewType.MONTH]: 'min-w-10',
    },
    day: {
      today: 'text-primary-800',
      past: 'text-gray-500',
      future: 'text-black',
    },
  },
});

export default function CalendarTimeScale(props: Props) {
  const { type, date, time, setTime } = props;

  const belowDesktop = useMediaQuery('(max-width:1023px)');

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
          {timeUtils.isSameDay(date, new Date()) && (
            <CalendarCurrentTime showLabel time={time} setTime={setTime} />
          )}
        </>
      )}
      {(type === calendarViewType.WEEK || type === calendarViewType.MONTH) &&
        Array.from({ length: 7 }).map((_, idx) => {
          let day = 'future' as 'past' | 'today' | 'future';
          if (type === calendarViewType.WEEK) {
            day = timeUtils.getDateStatus(
              new Date(
                weekRange.start.getFullYear(),
                weekRange.start.getMonth(),
                weekRange.start.getDate() + idx,
              ),
            );
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
              {belowDesktop ? timeUtils.getWeekDay(idx).slice(0, 3) : timeUtils.getWeekDay(idx)}
            </div>
          );
        })}
    </div>
  );
}
