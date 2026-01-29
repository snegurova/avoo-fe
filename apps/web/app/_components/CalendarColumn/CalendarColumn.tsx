import React, { useState, useRef, useCallback, useEffect } from 'react';
import { CalendarItem } from '@avoo/axios/types/apiTypes';
import { tv } from 'tailwind-variants';
import { MasterWithRelationsEntity } from '@avoo/axios/types/apiTypes';
import { CalendarViewType } from '@avoo/hooks/types/calendarViewType';
import CalendarEvent from '@/_components/CalendarEvent/CalendarEvent';
import { timeUtils } from '@avoo/shared';
import { PX_IN_MINUTE } from '@/_constants/time';
import CalendarCurrentTime from '../CalendarCurrentTime/CalendarCurrentTime';
import { useRouter } from 'next/navigation';
import { appRoutes } from '@/_routes/routes';
import { useToast } from '@/_hooks/useToast';

const DAY_CELLS = Array.from({ length: 96 });
const WEEK_CELLS = Array.from({ length: 7 });
const HOUR_SEPARATE = 4;

type Props = {
  data: CalendarItem | undefined;
  master: MasterWithRelationsEntity;
  type: CalendarViewType;
  date: Date;
  time: number;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  setToDate: React.Dispatch<React.SetStateAction<Date>>;
  setType: React.Dispatch<React.SetStateAction<CalendarViewType>>;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  isSingleWeek?: boolean;
};

const col = tv({
  base: 'flex-1 border-gray-300 grow relative bg-gray-100',
  variants: {
    type: {
      [CalendarViewType.DAY]: 'border-r min-w-25 md:min-w-55 2xl:min-w-90',
      [CalendarViewType.WEEK]: 'not-last:border-b min-h-38 md:min-h-40 flex flex-row flex-nowrap',
      [CalendarViewType.MONTH]: '',
    },
    isSingleWeek: {
      false: '',
      true: '2xl:min-w-55',
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
      [CalendarViewType.DAY]:
        'h-6 border-t last:border-b last:border-b-gray-300 pointer-events-none',
      [CalendarViewType.WEEK]:
        'h-full not-last:border-r border-gray-300 min-w-26 md:min-w-40 flex-1 p-1 flex flex-col justify-between gap-1',
      [CalendarViewType.MONTH]: '',
    },
    isAccessible: {
      true: 'bg-white',
    },
  },
});

export default function CalendarColumn(props: Props) {
  const {
    data,
    master,
    type,
    date,
    time,
    setDate,
    setToDate,
    setType,
    setTime,
    isSingleWeek = false,
  } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const toast = useToast();

  const [showEvents, setShowEvents] = useState<number>(1);

  const calculateShowEvents = useCallback(() => {
    if (!ref.current) return;
    const cellHeight = ref.current.clientHeight;
    const eventHeight = 22;
    const fitEvents = Math.floor((cellHeight - 22) / eventHeight);

    setShowEvents(fitEvents > 0 ? fitEvents : 1);
  }, [ref?.current?.clientHeight]);

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

    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(hours, mins, 0, 0);
    const cuurentDateTime = new Date();

    if (selectedDateTime < cuurentDateTime) return;

    if (!isAvailable) {
      toast.info('Selected time is out of available working hours');
    }

    router.push(
      appRoutes.OrderCreate +
        `?masterId=${master.id}&date=${timeUtils.formatDateTimeRounded(date, hours * 60 + mins)}`,
    );
  };

  const onWeekDayClick = (idx: number) => {
    if (!idx || idx < 0 || idx > 6) return;

    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + idx);
    setDate(newDate);
    setToDate(timeUtils.toDayEnd(newDate));
    setType(CalendarViewType.DAY);
  };

  return (
    <>
      {type === CalendarViewType.DAY && (
        <div className={col({ type, isSingleWeek })} onClick={onAvailabelTimeClick}>
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
          {DAY_CELLS.map((_, idx) => (
            <div
              key={'15mins' + idx}
              className={cell({ main: idx % HOUR_SEPARATE === 0, type })}
            ></div>
          ))}
          {data &&
            data.days[0].events.map((event) => (
              <CalendarEvent key={`${event.id}-${type}`} event={event} type={type} />
            ))}
          {timeUtils.isSameDay(date, new Date()) && (
            <CalendarCurrentTime time={time} setTime={setTime} isSingleWeek={isSingleWeek} />
          )}
        </div>
      )}
      {type === CalendarViewType.WEEK && (
        <div className={col({ type })} ref={ref}>
          {WEEK_CELLS.map((_, idx) => {
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
                onClick={() => onWeekDayClick(idx)}
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
