import React from 'react';
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
  setDate: React.Dispatch<React.SetStateAction<Date>>;
  setToDate: React.Dispatch<React.SetStateAction<Date>>;
  setType: React.Dispatch<React.SetStateAction<calendarViewType>>;
};

const col = tv({
  base: 'flex-1 border-border3 grow relative bg-cell',
  variants: {
    type: {
      [calendarViewType.DAY]: 'border-r min-w-90 ',
      [calendarViewType.WEEK]: 'not-last:border-b min-h-40 flex flex-row flex-nowrap bg-red',
      [calendarViewType.MONTH]: '',
    },
  },
});

const cell = tv({
  base: 'box-border relative z-5 ',
  variants: {
    main: {
      true: 'border-t-border3',
      false: 'border-t-border4',
    },
    type: {
      [calendarViewType.DAY]:
        'h-6 border-t last:border-b last:border-b-border3 pointer-events-none',
      [calendarViewType.WEEK]: 'h-full not-last:border-r border-border3 min-w-40 flex-1',
      [calendarViewType.MONTH]: '',
    },
  },
});

export default function CalendarColumn(props: Props) {
  const { data, master, type, date, setDate, setToDate, setType } = props;

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
          {timeUtils.isSameDay(date, new Date()) && <CalendarCurrentTime />}
        </div>
      )}
      {type === calendarViewType.WEEK && (
        <div className={col({ type })}>
          {Array.from({ length: 7 }).map((_, idx) => (
            <div
              key={'day' + idx}
              className={cell({ main: true, type })}
              data-day-index={idx}
              onClick={onWeekDayClick}
            >
              {data && data.days[idx] && (
                <>
                  <div className=''>
                    {data.days[idx].events.slice(0, 3).map((event) => (
                      <CalendarEvent key={`${event.id}-${type}`} event={event} type={type} />
                    ))}
                  </div>
                  {data.days[idx].events.length > 3 && (
                    <div className='text-xs text-time font-medium mt-0.5 px-1'>
                      +{data.days[idx].events.length - 3} more
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </>
  );
}
