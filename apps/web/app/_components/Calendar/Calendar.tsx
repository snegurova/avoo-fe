import React, { useEffect, useState, useRef } from 'react';
import CalendarColumn from '@/_components/CalendarColumn/CalendarColumn';
import CalendarColumnHead from '@/_components/CalendarColumnHead/CalendarColumnHead';
import CalendarTimeScale from '@/_components/CalendarTimeScale/CalendarTimeScale';
import { calendarHooks } from '@avoo/hooks';
import { PrivateCalendarQueryParams } from '@avoo/axios/types/apiTypes';
import { masterHooks } from '@avoo/hooks';
import CalendarControls from '@/_components/CalendarControls/CalendarControls';
import { calendarViewType } from '@avoo/hooks/types/calendarViewType';
import { timeUtils } from '@/_utils/timeUtils';
import { tv } from 'tailwind-variants';
import CalendarMonthView from '../CalendarMonthView/CalendarMonthView';
import { PX_IN_MINUTE } from '@/_constants/time';

const columnHeadContainer = tv({
  base: 'sticky bg-white z-10 ',
  variants: {
    type: {
      [calendarViewType.DAY]: 'flex pl-10.5 top-0 ',
      [calendarViewType.WEEK]: 'flex left-0 flex flex-col',
      [calendarViewType.MONTH]: 'hidden',
    },
  },
});

const mainContainer = tv({
  base: 'overflow-auto relative',
  variants: {
    type: {
      [calendarViewType.DAY]: 'min-w-full',
      [calendarViewType.WEEK]: 'w-full h-full flex',
      [calendarViewType.MONTH]: 'h-full',
    },
  },
});

const dataContainer = tv({
  base: 'flex ',
  variants: {
    type: {
      [calendarViewType.DAY]: 'h-580 pb-4',
      [calendarViewType.WEEK]: 'flex flex-col grow',
      [calendarViewType.MONTH]: 'flex flex-col grow h-full',
    },
  },
});

export default function Calendar() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [date, setDate] = useState<Date>(timeUtils.toDayBegin(new Date()));
  const [toDate, setToDate] = useState<Date>(timeUtils.toDayEnd(new Date()));
  const [type, setType] = useState<calendarViewType>(calendarViewType.DAY);
  const [params, setParams] = useState<PrivateCalendarQueryParams>({
    rangeFromDate: date.toISOString(),
    rangeToDate: toDate.toISOString(),
  });
  const [time, setTime] = useState(timeUtils.getMinutesInDay(new Date().toString()));

  useEffect(() => {
    scrollToCurrentTime();
  }, []);

  useEffect(() => {
    setParams({
      rangeFromDate: date.toISOString(),
      rangeToDate: toDate.toISOString(),
    });
  }, [date, toDate]);

  const scrollToCurrentTime = () => {
    if (type !== calendarViewType.DAY || !scrollRef.current) return;

    const scrollTop = time * PX_IN_MINUTE;

    scrollRef.current.scrollTo({
      top: scrollTop,
      behavior: 'smooth',
    });
  };

  const calendar = calendarHooks.useGetCalendar(params);
  const masters = masterHooks.useGetMastersProfileInfo();

  return (
    <div className='flex h-[calc(100%-54px)] w-full'>
      <div className='w-full flex flex-col'>
        <CalendarControls
          date={date}
          setDate={setDate}
          toDate={toDate}
          setToDate={setToDate}
          type={type}
          setType={setType}
          scrollToCurrentTime={scrollToCurrentTime}
          params={params}
          setParams={setParams}
          masters={masters ?? []}
        />
        <div className={mainContainer({ type })} ref={scrollRef}>
          <div className={columnHeadContainer({ type })}>
            {masters &&
              masters.map((master, idx) => (
                <CalendarColumnHead
                  key={`${master.id}-head`}
                  master={master}
                  idx={idx}
                  type={type}
                />
              ))}
          </div>

          <div className={dataContainer({ type })}>
            <CalendarTimeScale type={type} date={date} time={time} setTime={setTime} />
            {type !== calendarViewType.MONTH &&
              masters &&
              masters.map((master) => {
                const columnData = calendar?.find(
                  (schedule) => String(schedule.masterId) === String(master.id),
                );
                return (
                  <CalendarColumn
                    key={`${master.id}-col`}
                    data={columnData}
                    master={master}
                    type={type}
                    date={date}
                    setDate={setDate}
                    setToDate={setToDate}
                    setType={setType}
                    time={time}
                    setTime={setTime}
                  />
                );
              })}
            {type === calendarViewType.MONTH &&
              new Date(params.rangeFromDate).getTime() + 28 * 24 * 60 * 60 * 1000 <=
                new Date(params.rangeToDate).getTime() && (
                <CalendarMonthView
                  params={params}
                  setDate={setDate}
                  setToDate={setToDate}
                  setType={setType}
                />
              )}
          </div>
        </div>
      </div>
    </div>
  );
}
