import React, { useEffect, useState } from 'react';
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

type Props = {
  // Add your props here
};

const columnHeadContainer = tv({
  base: 'sticky bg-white z-10 ',
  variants: {
    type: {
      [calendarViewType.DAY]: 'flex pl-10.5 top-0 ',
      [calendarViewType.WEEK]: 'flex left-0 flex flex-col pt-10',
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
      [calendarViewType.MONTH]: '',
    },
  },
});

const dataContainer = tv({
  base: 'flex ',
  variants: {
    type: {
      [calendarViewType.DAY]: 'h-580 pb-4',
      [calendarViewType.WEEK]: 'flex flex-col grow',
      [calendarViewType.MONTH]: 'flex flex-col grow',
    },
  },
});

export default function Calendar(props: Props) {
  const {} = props;

  const [date, setDate] = useState<Date>(timeUtils.toDayBegin(new Date()));
  const [toDate, setToDate] = useState<Date>(timeUtils.toDayEnd(new Date()));

  const [type, setType] = useState<calendarViewType>(calendarViewType.DAY);

  const [params, setParams] = useState<PrivateCalendarQueryParams>({
    rangeFromDate: date.toISOString(),
    rangeToDate: toDate.toISOString(),
  });

  useEffect(() => {
    setParams({
      rangeFromDate: date.toISOString(),
      rangeToDate: toDate.toISOString(),
    });
  }, [date, toDate]);

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
        />
        <div className={mainContainer({ type })}>
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
            <CalendarTimeScale type={type} date={date} />
            {!calendarViewType.MONTH &&
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
                  />
                );
              })}
            {calendarViewType.MONTH && <div>Month view coming soon!</div>}
          </div>
        </div>
      </div>
    </div>
  );
}
