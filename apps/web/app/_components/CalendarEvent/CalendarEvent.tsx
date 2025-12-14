import React from 'react';
import { timeUtils } from '@/_utils/timeUtils';
import { PrivateEvent } from '@avoo/axios/types/apiTypes';
import { tv } from 'tailwind-variants';
import { orderStatus } from '@avoo/hooks/types/orderStatus';
import { PX_IN_MINUTE } from '@/_constants/time';
import { calendarViewType } from '@avoo/hooks/types/calendarViewType';

type Props = {
  event: PrivateEvent;
  type: calendarViewType;
};

const container = tv({
  base: 'z-6 p-0.5',
  variants: {
    type: {
      [calendarViewType.DAY]: 'absolute left-0 right-0  ',
      [calendarViewType.WEEK]: 'relative',
      [calendarViewType.MONTH]: '',
    },
  },
});

const eventItem = tv({
  base: 'border rounded-[3px] overflow-hidden h-full p-1 relative w-full flex flex-col items-start gap-0.5 cursor-pointer',
  variants: {
    status: {
      [orderStatus.PENDING]: 'border-pending bg-pendingBg text-pendingText',
      [orderStatus.CONFIRMED]: 'border-confirmed bg-confirmedBg text-confirmed',
      [orderStatus.COMPLETED]: 'border-completed bg-completedBg text-completed',
    },
  },
});

const eventLabel = tv({
  base: 'text-[10px] font-medium text-white leading-none px-1.5 py-1 flex items-center justify-center absolute top-0.5 right-0.5 rounded-2xl capitalize',
  variants: {
    status: {
      [orderStatus.PENDING]: 'bg-pending',
      conflict: 'bg-canceled',
    },
  },
});

export default function CalendarEvent(props: Props) {
  const { event, type } = props;

  const onEventClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    alert(`Event clicked: ${event.title}`);
  };

  return (
    <>
      {event.status === orderStatus.PENDING ||
      event.status === orderStatus.CONFIRMED ||
      event.status === orderStatus.COMPLETED ? (
        <div
          className={container({ type })}
          style={
            type === calendarViewType.DAY
              ? {
                  top: `${timeUtils.getMinutesInDay(event.start) * PX_IN_MINUTE}px`,
                  height: `${(timeUtils.getMinutesInDay(event.end) - timeUtils.getMinutesInDay(event.start)) * PX_IN_MINUTE}px`,
                }
              : undefined
          }
        >
          <button
            type='button'
            className={eventItem({ status: event.status })}
            onClick={onEventClick}
          >
            {event.status === orderStatus.PENDING && (
              <div className={eventLabel({ status: event.status })}>
                {event.status.toLocaleLowerCase()}
              </div>
            )}
            <div className='flex gap-1'>
              <span className='text-xs font-medium text-inherit leading-[1.15]'>
                {timeUtils.getTime(event.start)}
              </span>
              {typeof event.customerName === 'string' && event.customerName && (
                <span className='text-xs text-inherit leading-[1.15]'>{event.customerName}</span>
              )}
            </div>
            <h3 className='text-xs font-medium text-inherit leading-[1.15]'>{event.title}</h3>
          </button>
        </div>
      ) : null}
    </>
  );
}
