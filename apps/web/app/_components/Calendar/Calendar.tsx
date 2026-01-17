import React, { useEffect, useState, useRef, useMemo } from 'react';
import CalendarColumn from '@/_components/CalendarColumn/CalendarColumn';
import CalendarColumnHead from '@/_components/CalendarColumnHead/CalendarColumnHead';
import CalendarTimeScale from '@/_components/CalendarTimeScale/CalendarTimeScale';
import { calendarHooks } from '@avoo/hooks';
import { PrivateCalendarQueryParams } from '@avoo/axios/types/apiTypes';
import { masterHooks } from '@avoo/hooks';
import CalendarControls from '@/_components/CalendarControls/CalendarControls';
import { CalendarViewType } from '@avoo/hooks/types/calendarViewType';
import { timeUtils } from '@avoo/shared';
import { tv } from 'tailwind-variants';
import CalendarMonthView from '../CalendarMonthView/CalendarMonthView';
import { PX_IN_MINUTE } from '@/_constants/time';

const columnHeadContainer = tv({
  base: 'sticky bg-white z-10 ',
  variants: {
    type: {
      [CalendarViewType.DAY]: 'flex pl-10.5 top-0 ',
      [CalendarViewType.WEEK]: 'flex left-0 flex flex-col',
      [CalendarViewType.MONTH]: 'hidden',
    },
  },
});

const mainContainer = tv({
  base: 'overflow-auto relative',
  variants: {
    type: {
      [CalendarViewType.DAY]: 'min-w-full',
      [CalendarViewType.WEEK]: 'w-full h-full flex',
      [CalendarViewType.MONTH]: 'h-full',
    },
  },
});

const dataContainer = tv({
  base: 'flex ',
  variants: {
    type: {
      [CalendarViewType.DAY]: 'h-580 pb-4',
      [CalendarViewType.WEEK]: 'flex flex-col grow',
      [CalendarViewType.MONTH]: 'flex flex-col grow h-full',
    },
  },
});

// /** @description Master IDs */
// masterIds?: number[];
// /** @description Calendar start date (local, YYYY-MM-DD) */
// rangeFromDate: string;
// /** @description Calendar end date (local, YYYY-MM-DD) */
// rangeToDate: string;
// /** @description Service ID */
// serviceId?: number;
// /** @description Combination ID */
// combinationId?: number;
// /** @description User timezone */
// timezone?: string;

export default function Calendar() {
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [date, setDate] = useState<Date>(timeUtils.toDayBegin(new Date()));
  const [toDate, setToDate] = useState<Date>(timeUtils.toDayEnd(new Date()));
  const [masterIds, setMasterIds] = useState<number[] | undefined>(undefined);
  const [type, setType] = useState<CalendarViewType>(CalendarViewType.DAY);
  const [params, setParams] = useState<PrivateCalendarQueryParams>({
    rangeFromDate: timeUtils.formatDate(date),
    rangeToDate: timeUtils.formatDate(toDate),
  });
  const [time, setTime] = useState(timeUtils.getMinutesInDay(new Date().toString()));

  useEffect(() => {
    if (type !== CalendarViewType.DAY) return;

    scrollToCurrentTime();
  }, [type]);

  useEffect(() => {
    setParams((prev) => ({
      ...prev,
      rangeFromDate: timeUtils.formatDate(date),
      rangeToDate: timeUtils.formatDate(toDate),
      masterIds,
    }));
  }, [date, toDate, masterIds]);

  const scrollToCurrentTime = () => {
    if (type !== CalendarViewType.DAY || !scrollRef.current) return;

    let scrollValue;

    if (timeUtils.isSameDay(date, new Date())) {
      scrollValue = time * PX_IN_MINUTE - (scrollRef.current.clientHeight - 76) / 2;
    } else {
      scrollValue = 0;
    }

    scrollRef.current.scrollTo({
      top: scrollValue,
      behavior: 'smooth',
    });
  };

  const calendar = calendarHooks.useGetCalendar(params);
  const masters = masterHooks.useGetMastersProfileInfo();

  const filteredMasters = useMemo(() => {
    if (!masters || (masterIds && masterIds.length === 0)) return [];
    if (!masterIds) return masters;
    return masters.filter((master) => masterIds.includes(Number(master.id)));
  }, [masters, masterIds]);

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
          masterIds={masterIds}
          setMasterIds={setMasterIds}
        />
        <div className={mainContainer({ type })} ref={scrollRef}>
          <div className={columnHeadContainer({ type })}>
            {filteredMasters.map((master, idx) => (
              <CalendarColumnHead key={`${master.id}-head`} master={master} idx={idx} type={type} />
            ))}
          </div>

          {filteredMasters.length > 0 && (
            <div className={dataContainer({ type })}>
              <CalendarTimeScale type={type} date={date} time={time} setTime={setTime} />
              {type !== CalendarViewType.MONTH &&
                filteredMasters.map((master) => {
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
              {type === CalendarViewType.MONTH &&
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
          )}
        </div>
      </div>
    </div>
  );
}
