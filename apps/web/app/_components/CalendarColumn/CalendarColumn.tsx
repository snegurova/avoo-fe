import React from 'react';
import { CalendarItem } from '@avoo/axios/types/apiTypes';
import { tv } from 'tailwind-variants';
import { MasterWithRelationsEntity } from '@avoo/axios/types/apiTypes';
import { calendarViewType } from '@avoo/hooks/types/calendarViewType';
import CalendarEvent from '@/_components/CalendarEvent/CalendarEvent';

type Props = {
  data: CalendarItem | undefined;
  master: MasterWithRelationsEntity;
  type: calendarViewType;
};

const cell = tv({
  base: 'box-border h-6 border-t last:border-b last:border-b-border3',
  variants: {
    main: {
      true: 'border-t-border3',
      false: 'border-t-border4',
    },
    available: {
      true: 'bg-white',
      false: 'bg-cell',
    },
  },
});

export default function CalendarColumn(props: Props) {
  const { data, master, type } = props;

  return (
    <>
      {type === calendarViewType.DAY && (
        <div className='min-w-90 flex-1 border-r border-border3 grow relative'>
          {Array.from({ length: 96 }).map((_, idx) => (
            <div
              key={'15mins' + idx}
              className={cell({ main: idx % 4 === 0, available: true })}
            ></div>
          ))}
          {data &&
            data.days[0].events.map((event) => (
              <CalendarEvent key={`${event.id}-${type}`} event={event} />
            ))}
        </div>
      )}
    </>
  );
}
