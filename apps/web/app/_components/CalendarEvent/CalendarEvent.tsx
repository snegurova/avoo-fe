import React from 'react';
import { timeUtils } from '@/_utils/timeUtils';
import { PrivateEvent } from '@avoo/axios/types/apiTypes';
import { tv } from 'tailwind-variants';
import { orderStatus } from '@avoo/hooks/types/orderStatus';
import { PX_IN_MINUTE } from '@/_constants/time';
import { calendarViewType } from '@avoo/hooks/types/calendarViewType';
import BookmarkCheck from '@/_icons/BookmarkCheck';
import SearchActivity from '@/_icons/SearchActivity';
import CheckCircle from '@/_icons/CheckCircle';

type Props = {
  event: PrivateEvent;
  type: calendarViewType;
};

const container = tv({
  base: 'z-6',
  variants: {
    type: {
      [calendarViewType.DAY]: 'absolute left-0 right-0 p-0.5',
      [calendarViewType.WEEK]: 'relative',
      [calendarViewType.MONTH]: '',
    },
  },
});

const eventItem = tv({
  base: 'border rounded-[3px] overflow-hidden h-full relative w-full flex no-wrap cursor-pointer',
  variants: {
    status: {
      [orderStatus.PENDING]: 'border-orange-500 bg-orange-50 text-orange-700',
      [orderStatus.CONFIRMED]: 'border-blue-800 bg-blue-50 text-blue-800',
      [orderStatus.COMPLETED]: 'border-purple-800 bg-purple-50 text-purple-800',
    },
    type: {
      [calendarViewType.DAY]: 'flex-col items-start gap-0.5 p-1 font-medium',
      [calendarViewType.WEEK]: 'items-center gap-1 py-0.5 px-1 font-normal',
      [calendarViewType.MONTH]: 'items-center gap-1 py-0.5 px-1 font-normal',
    },
  },
});

const eventLabel = tv({
  base: 'text-[10px] font-medium text-white leading-none px-1.5 py-1 flex items-center justify-center absolute top-0.5 right-0.5 rounded-2xl capitalize',
  variants: {
    status: {
      [orderStatus.PENDING]: 'bg-orange-500',
      conflict: 'bg-red-800',
    },
  },
});

const icon = tv({
  base: 'w-3 h-3 shrink-0',
  variants: {
    status: {
      [orderStatus.PENDING]: 'fill-orange-500',
      [orderStatus.CONFIRMED]: 'fill-blue-800',
      [orderStatus.COMPLETED]: 'fill-purple-800',
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
            className={eventItem({ status: event.status, type })}
            onClick={onEventClick}
          >
            {type === calendarViewType.DAY && event.status === orderStatus.PENDING && (
              <div className={eventLabel({ status: event.status })}>
                {event.status.toLocaleLowerCase()}
              </div>
            )}
            {type !== calendarViewType.DAY && (
              <>
                {event.status === orderStatus.PENDING && (
                  <SearchActivity className={icon({ status: event.status })} />
                )}
                {event.status === orderStatus.CONFIRMED && (
                  <BookmarkCheck className={icon({ status: event.status })} />
                )}
                {event.status === orderStatus.COMPLETED && (
                  <CheckCircle className={icon({ status: event.status })} />
                )}
              </>
            )}
            <div className='flex gap-1 shrink-0 items-center'>
              <span className='text-xs font-medium text-inherit leading-[1.15]'>
                {timeUtils.getTime(event.start)}
              </span>
              {typeof event.customerName === 'string' && event.customerName && (
                <span className='text-xs text-inherit leading-[1.15]'>{event.customerName}</span>
              )}
            </div>
            {type === calendarViewType.DAY && (
              <h3 className='text-xs font-inherit text-inherit leading-[1.15]'>{event.title}</h3>
            )}
          </button>
        </div>
      ) : null}
    </>
  );
}
