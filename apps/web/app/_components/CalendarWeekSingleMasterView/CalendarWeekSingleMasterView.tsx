import React from 'react';

import { PrivateEvent } from '@avoo/axios/types/apiTypes';
import { CalendarItem } from '@avoo/axios/types/apiTypes';
import { MasterWithRelationsEntity } from '@avoo/axios/types/apiTypes';
import { CalendarType } from '@avoo/hooks/types/calendarType';
import { CalendarViewType } from '@avoo/hooks/types/calendarViewType';
import { useCalendarStore } from '@avoo/store';

import CalendarColumn from '@/_components/CalendarColumn/CalendarColumn';
import CalendarTimeScale from '@/_components/CalendarTimeScale/CalendarTimeScale';

type Props = {
  time: number;
  setTime: React.Dispatch<React.SetStateAction<number>>;
  data: CalendarItem | undefined;
  master: MasterWithRelationsEntity;
  availableBooking: boolean;
  calendarType: CalendarType;
  selectOrder?: (event: PrivateEvent | null) => void;
};

export default function CalendarWeekSingleMasterView(props: Props) {
  const { time, setTime, data, master, availableBooking, calendarType, selectOrder } = props;
  const date = useCalendarStore((state) => state.date);
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
              time={time}
              setTime={setTime}
              isSingleWeek
              availableBooking={availableBooking}
              calendarType={calendarType}
              selectOrder={selectOrder}
            />
          ))}
      </div>
    </>
  );
}
