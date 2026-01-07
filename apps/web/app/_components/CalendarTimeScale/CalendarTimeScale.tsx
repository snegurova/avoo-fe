import React from 'react';
import { CalendarViewType } from '@avoo/hooks/types/calendarViewType';
import { timeUtils } from '@avoo/shared';
import CalendarCurrentTime from '../CalendarCurrentTime/CalendarCurrentTime';
import { tv } from 'tailwind-variants';
import useMediaQuery from '@mui/material/useMediaQuery';
import { DateStatus } from '@avoo/hooks/types/dateStatus';

const WEEK_CELLS = Array.from({ length: 7 });
const DAY_CELLS = Array.from({ length: 24 });

type Props = {
  type: CalendarViewType;
  date: Date;
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
};

const container = tv({
  base: 'shrink-0 sticky bg-white z-7',
  variants: {
    type: {
      [CalendarViewType.DAY]: 'left-0 w-10.5',
      [CalendarViewType.WEEK]: 'top-0 min-w-full h-10 flex flex-row flex-nowrap',
      [CalendarViewType.MONTH]: 'top-0 h-10 grid grid-cols-7 min-w-70',
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
      [CalendarViewType.WEEK]: 'min-w-26 md:min-w-40',
      [CalendarViewType.MONTH]: 'min-w-10',
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

  const defineDateStatus = (dayIndex: number): DateStatus => {
    let day = DateStatus.FUTURE as DateStatus;
    if (type === CalendarViewType.WEEK) {
      day = timeUtils.getDateStatus(
        new Date(
          weekRange.start.getFullYear(),
          weekRange.start.getMonth(),
          weekRange.start.getDate() + dayIndex,
        ),
      );
    }

    return day;
  };

  const getWeekDate = (idx: number) =>
    new Date(
      weekRange.start.getFullYear(),
      weekRange.start.getMonth(),
      weekRange.start.getDate() + idx,
    );

  return (
    <div className={container({ type })}>
      {type === CalendarViewType.DAY && (
        <>
          {DAY_CELLS.map((_, idx) => (
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
      {(type === CalendarViewType.WEEK || type === CalendarViewType.MONTH) &&
        WEEK_CELLS.map((_, idx) => {
          const day = defineDateStatus(idx);
          return (
            <div key={type + idx} className={weekDay({ day })}>
              {type === CalendarViewType.WEEK && (
                <span
                  className={dateValue({
                    day,
                  })}
                >
                  {getWeekDate(idx).getDate()}
                </span>
              )}
              {belowDesktop ? timeUtils.getWeekDay(idx).slice(0, 3) : timeUtils.getWeekDay(idx)}
            </div>
          );
        })}
    </div>
  );
}
