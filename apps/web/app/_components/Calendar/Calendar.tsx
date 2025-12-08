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

type Props = {
  // Add your props here
};

export default function Calendar(props: Props) {
  const {} = props;

  const [date, setDate] = useState<Date>(timeUtils.toDayBegin(new Date()));
  const [type, setType] = useState<calendarViewType>(calendarViewType.DAY);

  const [params, setParams] = useState<PrivateCalendarQueryParams>({
    rangeFromDate: date.toISOString(),
    rangeToDate: new Date(date.getTime() + 1 * 24 * 60 * 60 * 1000 - 1).toISOString(),
  });

  useEffect(() => {
    let toDate: Date;
    if (type === calendarViewType.DAY) {
      toDate = new Date(date.getTime() + 1 * 24 * 60 * 60 * 1000 - 1);
    } else if (type === calendarViewType.WEEK) {
      toDate = new Date(date.getTime() + 7 * 24 * 60 * 60 * 1000 - 1);
    } else {
      toDate = new Date(date.getTime() + 31 * 24 * 60 * 60 * 1000 - 1);
    }
    setParams({
      rangeFromDate: date.toISOString(),
      rangeToDate: toDate.toISOString(),
    });
  }, [date, type]);

  const calendar = calendarHooks.useGetCalendar(params);
  const masters = masterHooks.useGetMastersProfileInfo();

  return (
    <div className='flex h-[calc(100%-54px)] w-full'>
      <div className='w-full flex flex-col'>
        <CalendarControls date={date} setDate={setDate} type={type} setType={setType} />
        <div className='overflow-auto min-w-full'>
          <div className='flex pl-10.5 sticky top-0 bg-white z-2'>
            {masters &&
              masters.map((master, idx) => (
                <CalendarColumnHead key={`${master.id}-head`} master={master} idx={idx} />
              ))}
          </div>
          <div className='flex h-580 pb-4'>
            <CalendarTimeScale type={type} />
            {masters &&
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
                  />
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
