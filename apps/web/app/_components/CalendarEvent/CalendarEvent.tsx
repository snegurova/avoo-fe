import React from 'react';
import { timeUtils } from '@avoo/shared';
import { PrivateEvent } from '@avoo/axios/types/apiTypes';
import { tv } from 'tailwind-variants';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import { PX_IN_MINUTE } from '@/_constants/time';
import { CalendarViewType } from '@avoo/hooks/types/calendarViewType';
import BookmarkCheck from '@/_icons/BookmarkCheck';
import SearchActivity from '@/_icons/SearchActivity';
import CheckCircle from '@/_icons/CheckCircle';

type Props = {
  event: PrivateEvent;
  type: CalendarViewType;
  onEventSelect?: (event: PrivateEvent) => void;
};

const container = tv({
  base: 'z-6',
  variants: {
    type: {
      [CalendarViewType.DAY]: 'absolute left-0 right-0 p-0.5',
      [CalendarViewType.WEEK]: 'relative',
      [CalendarViewType.MONTH]: '',
    },
  },
});

const eventItem = tv({
  base: 'border rounded-[3px] overflow-hidden h-full relative w-full flex no-wrap cursor-pointer',
  variants: {
    status: {
      [OrderStatus.PENDING]: 'border-orange-500 bg-orange-50 text-orange-700',
      [OrderStatus.CONFIRMED]: 'border-blue-800 bg-blue-50 text-blue-800',
      [OrderStatus.COMPLETED]: 'border-purple-800 bg-purple-50 text-purple-800',
    },
    type: {
      [CalendarViewType.DAY]: 'flex-col items-start gap-0.5 p-1 font-medium',
      [CalendarViewType.WEEK]: 'items-center gap-1 py-0.5 px-1 font-normal',
      [CalendarViewType.MONTH]: 'items-center gap-1 py-0.5 px-1 font-normal',
    },
  },
});

const eventLabel = tv({
  base: 'text-[10px] font-medium text-white leading-none px-1.5 py-1 flex items-center justify-center absolute top-0.5 right-0.5 rounded-2xl capitalize',
  variants: {
    status: {
      [OrderStatus.PENDING]: 'bg-orange-500',
      conflict: 'bg-red-800',
    },
  },
});

const icon = tv({
  base: 'w-3 h-3 shrink-0',
  variants: {
    status: {
      [OrderStatus.PENDING]: 'fill-orange-500',
      [OrderStatus.CONFIRMED]: 'fill-blue-800',
      [OrderStatus.COMPLETED]: 'fill-purple-800',
    },
  },
});

export default function CalendarEvent(props: Props) {
  const { event, type, onEventSelect } = props;

  const onEventClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (onEventSelect) {
      onEventSelect(event);
    }
  };

  return (
    <>
      {event.status === OrderStatus.PENDING ||
      event.status === OrderStatus.CONFIRMED ||
      event.status === OrderStatus.COMPLETED ? (
        <div
          className={container({ type })}
          style={
            type === CalendarViewType.DAY
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
            {type === CalendarViewType.DAY && event.status === OrderStatus.PENDING && (
              <div className={eventLabel({ status: event.status })}>
                {event.status.toLocaleLowerCase()}
              </div>
            )}
            {type !== CalendarViewType.DAY && (
              <>
                {event.status === OrderStatus.PENDING && (
                  <SearchActivity className={icon({ status: event.status })} />
                )}
                {event.status === OrderStatus.CONFIRMED && (
                  <BookmarkCheck className={icon({ status: event.status })} />
                )}
                {event.status === OrderStatus.COMPLETED && (
                  <CheckCircle className={icon({ status: event.status })} />
                )}
              </>
            )}
            <div className='flex gap-1 shrink-0 items-center'>
              <span className='text-xs font-medium text-inherit leading-[1.15]'>
                {timeUtils.getTime(event.start)}
              </span>
              {typeof event.customerName === 'string' && (
                <span className='text-xs text-inherit leading-[1.15]'>{event.customerName}</span>
              )}
            </div>
            {type === CalendarViewType.DAY && (
              <h3 className='text-xs font-inherit text-inherit leading-[1.15]'>{event.title}</h3>
            )}
          </button>
        </div>
      ) : null}
    </>
  );
}
