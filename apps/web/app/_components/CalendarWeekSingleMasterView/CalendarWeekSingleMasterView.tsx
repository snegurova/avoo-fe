import React from 'react';
import CalendarColumn from '@/_components/CalendarColumn/CalendarColumn';
import CalendarTimeScale from '@/_components/CalendarTimeScale/CalendarTimeScale';
import { CalendarViewType } from '@avoo/hooks/types/calendarViewType';
import { CalendarItem } from '@avoo/axios/types/apiTypes';
import { MasterWithRelationsEntity } from '@avoo/axios/types/apiTypes';

type Props = {
  date: Date;
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  data: CalendarItem | undefined;
  master: MasterWithRelationsEntity;
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  setToDate: React.Dispatch<React.SetStateAction<Date>>;
  setType: React.Dispatch<React.SetStateAction<CalendarViewType>>;
  availableBooking: boolean;
};

export default function CalendarWeekSingleMasterView(props: Props) {
  const { date, time, setTime, data, master, setDate, setToDate, setType, availableBooking } =
    props;
  return (
    <>
      <div className='pl-10.5 shrink-0 sticky top-0 min-w-185.5 md:min-w-395.5 z-8 bg-white'>
        <CalendarTimeScale
          type={CalendarViewType.WEEK}
          date={date}
          time={time}
          setTime={setTime}
          hideBorder
        />
      </div>
      <div className='h-580 pb-4 flex min-w-min'>
        <CalendarTimeScale type={CalendarViewType.DAY} date={date} time={time} setTime={setTime} />
        {data &&
          data.days.map((item, idx) => (
            <CalendarColumn
              key={'solo-week' + idx}
              data={{
                ...data,
                days: [item],
              }}
              master={master}
              type={CalendarViewType.DAY}
              date={new Date(item.date)}
              time={time}
              setTime={setTime}
              setDate={setDate}
              setToDate={setToDate}
              setType={setType}
              isSingleWeek
              availableBooking={availableBooking}
            />
          ))}
      </div>
    </>
  );
}
