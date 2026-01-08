import { timeUtils } from '@avoo/shared';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { tv } from 'tailwind-variants';
import { PrivateCalendarByDatesQueryParams } from '@avoo/axios/types/apiTypes';
import { calendarHooks } from '@avoo/hooks';
import { CalendarViewType } from '@avoo/hooks/types/calendarViewType';
import CalendarEvent from '../CalendarEvent/CalendarEvent';
import { DateStatus } from '@avoo/hooks/types/dateStatus';

type Props = {
  params: PrivateCalendarByDatesQueryParams;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  setToDate: React.Dispatch<React.SetStateAction<Date>>;
  setType: React.Dispatch<React.SetStateAction<CalendarViewType>>;
};

const dayCell = tv({
  base: 'border-b border-r nth-[7n]:border-r-0 border-gray-300 box-border p-1 min-h-20 overflow-hidden flex flex-col gap-1',
  variants: {
    isAccessible: {
      true: 'bg-white',
      false: 'bg-gray-100',
    },
  },
});

const dateValue = tv({
  base: 'w-8 h-8 flex items-center justify-center font-medium text-sm gap-1 shrink-0',
  variants: {
    day: {
      today: 'rounded-full text-white bg-primary-800',
      past: 'text-gray-500',
      future: 'text-black',
    },
  },
});

const grid = tv({
  base: 'h-[calc(100%-40px)] grid grid-cols-7 w-full min-w-70 flex-1',
  variants: {
    count: {
      28: 'grid-rows-4 min-h-80',
      35: 'grid-rows-5 min-h-100',
      42: 'grid-rows-6 min-h-120',
    },
  },
});

export default function CalendarMonthView(props: Props) {
  const { params, setDate, setToDate, setType } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  const [showEvents, setShowEvents] = useState<number>(1);

  const calendar = calendarHooks.useGetCalendarByDates(params);

  const calculateShowEvents = useCallback(() => {
    if (!ref.current) return;
    const cellHeight =
      ref.current.clientHeight / (calendar ? Math.floor(calendar.days.length / 7) : 6);
    const eventHeight = 22;
    const fitEvents = Math.floor((cellHeight - 58) / eventHeight);

    setShowEvents(fitEvents > 0 ? fitEvents : 1);
  }, [calendar?.days.length, ref?.current?.clientHeight]);

  useEffect(() => {
    if (!ref.current) return;
    const resizeObserver = new ResizeObserver(() => {
      calculateShowEvents();
    });
    resizeObserver.observe(ref.current);
    return () => {
      resizeObserver.disconnect();
    };
  }, [ref.current]);

  const onDayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const dateStr = e.currentTarget.getAttribute('data-date');
    if (!dateStr) return;
    const date = new Date(dateStr);

    setDate(timeUtils.toDayBegin(date));
    setToDate(timeUtils.toDayEnd(date));
    setType(CalendarViewType.DAY);
  };

  return (
    <div
      ref={ref}
      className={grid({ count: calendar ? (calendar.days.length as 28 | 35 | 42) : 28 })}
    >
      {calendar &&
        calendar.days.map(({ date, events, isWorkingDay }, idx) => {
          const dayDate = new Date(date);
          const day: DateStatus = timeUtils.getDateStatus(dayDate);
          const slicedEvents = events.length > showEvents ? events.slice(0, showEvents) : events;
          return (
            <div
              key={idx}
              className={dayCell({ isAccessible: day !== 'past' && isWorkingDay })}
              data-date={date}
              onClick={onDayClick}
            >
              <div className={dateValue({ day })}>{dayDate.getDate()}</div>
              {events && (
                <div className='flex flex-col flex-1 gap-1 justify-between'>
                  <div className='flex flex-col gap-0.5'>
                    {slicedEvents.map((event, eIdx) => (
                      <CalendarEvent key={eIdx} event={event} type={CalendarViewType.MONTH} />
                    ))}
                  </div>
                  {slicedEvents.length < events.length && (
                    <div className='text-[10px] text-gray-600 leading-none'>
                      +{events.length - showEvents} more
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
}
