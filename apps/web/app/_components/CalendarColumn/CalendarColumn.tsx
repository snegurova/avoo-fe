import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import { tv } from 'tailwind-variants';

import { CalendarItem, MasterWithRelationsEntity, PrivateEvent } from '@avoo/axios/types/apiTypes';
import { CalendarType } from '@avoo/hooks/types/calendarType';
import { CalendarViewType } from '@avoo/hooks/types/calendarViewType';
import { timeUtils } from '@avoo/shared';

import CalendarCurrentTime from '@/_components/CalendarCurrentTime/CalendarCurrentTime';
import CalendarEvent from '@/_components/CalendarEvent/CalendarEvent';
import { PX_IN_MINUTE } from '@/_constants/time';
import { localizationHooks } from '@/_hooks/localizationHooks';
import { useToast } from '@/_hooks/useToast';
import { AppRoutes } from '@/_routes/routes';

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
  selectOrder?: (event: PrivateEvent | null) => void;
  availableBooking: boolean;
  calendarType: CalendarType;
  onClickDateTime?: (date: string, master: MasterWithRelationsEntity) => void;
};

const col = tv({
  base: 'flex-1 border-gray-300 grow relative bg-gray-100 overflow-hidden',
  variants: {
    type: {
      [CalendarViewType.DAY]: 'border-r min-w-25 md:min-w-55',
      [CalendarViewType.WEEK]: 'not-last:border-b min-h-38 md:min-h-40 flex flex-row flex-nowrap',
      [CalendarViewType.MONTH]: '',
    },
    isSingleWeek: {
      false: '',
      true: '2xl:min-w-55',
    },
    calendarType: {
      [CalendarType.REGULAR]: '',
      [CalendarType.WIDGET]: '',
      [CalendarType.SELECTOR]: '',
    },
  },
  compoundVariants: [
    {
      calendarType: CalendarType.REGULAR,
      type: CalendarViewType.DAY,
      className: 'md:min-w-55 2xl:min-w-90',
    },
    {
      calendarType: CalendarType.WIDGET,
      type: CalendarViewType.DAY,
      className: 'lg:min-w-25 xl:min-w-55',
    },
    {
      calendarType: CalendarType.SELECTOR,
      type: CalendarViewType.DAY,
      className: 'lg:min-w-25',
    },
  ],
});

const timeCell = tv({
  base: 'absolute left-1 top-1/2 -translate-y-1/2 leading-none text-primary-800 available-time text-sm opacity-0',
  variants: {
    hovered: {
      true: 'opacity-100',
    },
  },
});

const cell = tv({
  base: 'box-border relative z-5 overflow-hidden outline outline-1 outline-offset-[-1px] outline-transparent',
  variants: {
    main: {
      true: 'border-t-gray-300',
      false: 'border-t-gray-200',
    },
    type: {
      [CalendarViewType.DAY]:
        'h-6 border-t last:border-b last:border-b-gray-300 pointer-events-none relative',
      [CalendarViewType.WEEK]:
        'h-full not-last:border-r border-gray-300 min-w-26 md:min-w-40 flex-1 p-1 flex flex-col justify-between gap-1 hover:bg-primary-200  hover:outline-primary-800',
      [CalendarViewType.MONTH]: 'hover:bg-primary-200  hover:outline-primary-800',
    },
    isAccessible: {
      true: 'bg-white',
    },
    hovered: {
      true: 'bg-primary-200  outline-primary-800',
    },
  },
});

export default function CalendarColumn(props: Props) {
  // Track hovered cell index for DAY view
  const [hoveredCellIdx, setHoveredCellIdx] = useState<number | null>(null);
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
    selectOrder,
    availableBooking,
    calendarType,
    onClickDateTime,
  } = props;
  const ref = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const toast = useToast();

  const [showEvents, setShowEvents] = useState<number>(1);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const y = e.clientY - rect.top;
    const cellHeight = PX_IN_MINUTE * 15;
    let idx = Math.floor(y / cellHeight);
    if (idx < 0) idx = 0;
    if (idx >= DAY_CELLS.length) idx = DAY_CELLS.length - 1;
    setHoveredCellIdx(idx);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredCellIdx(null);
  }, []);

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
    if (!availableBooking) return;
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
    const currentDateTime = new Date();

    if (!isAvailable) {
      toast.info('Selected time is out of available working hours');
    }

    if (onClickDateTime) {
      onClickDateTime(timeUtils.formatDateTimeRounded(date, hours * 60 + mins), master);
    }

    if (calendarType !== CalendarType.SELECTOR) {
      if (selectedDateTime < currentDateTime) {
      }

      router.push(
        `${localizationHooks.useWithLocale(AppRoutes.OrderCreate)}?masterId=${master.id}&date=${encodeURIComponent(
          timeUtils.formatDateTimeRounded(date, hours * 60 + mins),
        )}`,
      );
    }
  };

  const onWeekDayClick = (idx: number) => {
    if (!idx || idx < 0 || idx > 6) return;

    const newDate = new Date(date);
    newDate.setDate(newDate.getDate() + idx);
    setDate(newDate);
    setToDate(timeUtils.toDayEnd(newDate));
    setType(CalendarViewType.DAY);
  };

  const handleOrderSelect = useCallback(
    (event: PrivateEvent) => {
      if (selectOrder) selectOrder(event);
    },
    [selectOrder],
  );

  const calculateTimeInCell = (idx: number) => {
    const totalMinutes = idx * 15;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  return (
    <>
      {type === CalendarViewType.DAY && (
        <div
          className={col({ type, isSingleWeek, calendarType })}
          onClick={onAvailabelTimeClick}
          ref={ref}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
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
              className={cell({
                main: idx % HOUR_SEPARATE === 0,
                type,
                hovered: hoveredCellIdx === idx,
              })}
            >
              <span className={timeCell({ hovered: hoveredCellIdx === idx })}>
                {calculateTimeInCell(idx)}
              </span>
            </div>
          ))}
          {data &&
            data.days[0].events.map((event) => (
              <CalendarEvent
                key={`${event.id}-${type}`}
                event={event}
                type={type}
                onEventSelect={handleOrderSelect}
              />
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
                        <CalendarEvent
                          key={`${event.id}-${type}`}
                          event={event}
                          type={type}
                          onEventSelect={handleOrderSelect}
                        />
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
