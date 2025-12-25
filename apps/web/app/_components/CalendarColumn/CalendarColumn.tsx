import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CalendarItem } from '@avoo/axios/types/apiTypes';
import { tv } from 'tailwind-variants';
import { MasterWithRelationsEntity } from '@avoo/axios/types/apiTypes';
import { calendarViewType } from '@avoo/hooks/types/calendarViewType';
import CalendarEvent from '@/_components/CalendarEvent/CalendarEvent';
import { timeUtils } from '@/_utils/timeUtils';
import { PX_IN_MINUTE } from '@/_constants/time';
import CalendarCurrentTime from '../CalendarCurrentTime/CalendarCurrentTime';

type Props = {
  data: CalendarItem | undefined;
  master: MasterWithRelationsEntity;
  type: calendarViewType;
  date: Date;
  time: number;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  setToDate: React.Dispatch<React.SetStateAction<Date>>;
  setType: React.Dispatch<React.SetStateAction<calendarViewType>>;
  setTime: React.Dispatch<React.SetStateAction<number>>;
};

const col = tv({
  base: 'flex-1 border-gray-300 grow relative bg-gray-100',
  variants: {
    type: {
      [calendarViewType.DAY]: 'border-r min-w-90',
      [calendarViewType.WEEK]: 'not-last:border-b min-h-40 flex flex-row flex-nowrap',
      [calendarViewType.MONTH]: '',
    },
  },
});

const cell = tv({
  base: 'box-border relative z-5 transition-colors overflow-hidden',
  variants: {
    main: {
      true: 'border-t-gray-300',
      false: 'border-t-gray-200',
    },
    type: {
      [calendarViewType.DAY]:
        'h-6 border-t last:border-b last:border-b-gray-300 pointer-events-none',
      [calendarViewType.WEEK]:
        'h-full not-last:border-r border-gray-300 min-w-40 flex-1 p-1 flex flex-col justify-between gap-1',
      [calendarViewType.MONTH]: '',
    },
    isAccessible: {
      true: 'bg-white',
    },
  },
});

export default function CalendarColumn(props: Props) {
  const { data, master, type, date, time, setDate, setToDate, setType, setTime } = props;
  const ref = useRef<HTMLDivElement | null>(null);

  const [showEvents, setShowEvents] = useState<number>(1);

  const calculateShowEvents = useCallback(() => {
    if (!ref.current) return;
    const cellHeight = ref.current.clientHeight;
    const eventHeight = 22;
    const fitEvents = Math.floor((cellHeight - 22) / eventHeight);

    setShowEvents(fitEvents > 0 ? fitEvents : 1);
  }, [ref?.current?.clientHeight]);

  useEffect(() => {
    window.addEventListener('resize', calculateShowEvents);
    return () => {
      window.removeEventListener('resize', calculateShowEvents);
    };
  }, []);

  useEffect(() => {
    calculateShowEvents();
  }, [data]);

  const onAvailabelTimeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const parent = e.currentTarget.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const minutes = Math.floor(y / PX_IN_MINUTE);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    const target = e.target as HTMLElement;
    const isAvailable = target.classList.contains('available-time');
    alert(
      `Available time clicked at ${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} for master ${master.name} (Available: ${isAvailable})`,
    );
  };

  const onWeekDayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const dayIndex = e.currentTarget.getAttribute('data-day-index');
    if (dayIndex === null) return;

    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + Number(dayIndex));
    setDate(newDate);
    setToDate(timeUtils.toDayEnd(newDate));
    setType(calendarViewType.DAY);
  };

  return (
    <>
      {type === calendarViewType.DAY && (
        <div className={col({ type })} onClick={onAvailabelTimeClick}>
          {data &&
            data.days[0].availability?.map((avail, idx) => (
              <div
                key={`avail-${idx}`}
                className='absolute left-0 right-0 bg-white z-1 available-time'
                style={{
                  top: `${timeUtils.getMinutesInDay(avail.start) * PX_IN_MINUTE}px`,
                  height: `${(timeUtils.getMinutesInDay(avail.end) - timeUtils.getMinutesInDay(avail.start)) * PX_IN_MINUTE}px`,
                }}
              ></div>
            ))}
          {Array.from({ length: 96 }).map((_, idx) => (
            <div key={'15mins' + idx} className={cell({ main: idx % 4 === 0, type })}></div>
          ))}
          {data &&
            data.days[0].events.map((event) => (
              <CalendarEvent key={`${event.id}-${type}`} event={event} type={type} />
            ))}
          {timeUtils.isSameDay(date, new Date()) && (
            <CalendarCurrentTime time={time} setTime={setTime} />
          )}
        </div>
      )}
      {type === calendarViewType.WEEK && (
        <div className={col({ type })} ref={ref}>
          {Array.from({ length: 7 }).map((_, idx) => {
            const slicedEvents =
              data && data.days[idx] ? data.days[idx].events.slice(0, showEvents) : [];

            return (
              <div
                key={'day' + idx}
                className={cell({
                  main: true,
                  type,
                  isAccessible: data?.days[idx]?.isWorkingDay,
                })}
                data-day-index={idx}
                onClick={onWeekDayClick}
              >
                {data && data.days[idx] && (
                  <>
                    <div className='flex flex-col gap-0.5'>
                      {slicedEvents.map((event) => (
                        <CalendarEvent key={`${event.id}-${type}`} event={event} type={type} />
                      ))}
                    </div>
                    {data.days[idx].events.length > showEvents && (
                      <div className='text-[10px] text-gray-600 mt-0.5 px-1 leading-none'>
                        +{data.days[idx].events.length - showEvents} more
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
