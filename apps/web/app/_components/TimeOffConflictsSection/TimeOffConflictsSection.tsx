'use client';

import React from 'react';

import type { AffectedBooking } from '@avoo/hooks';
import { timeUtils } from '@avoo/shared';

import HistoryCard from '../HistoryCard/HistoryCard';
import TimeOffConflictAlert from '../TimeOffConflictAlert/TimeOffConflictAlert';

type Props = {
  isConflictsLoading: boolean;
  conflictMessage: string | null;
  affectedBookings: AffectedBooking[];
};

export default function TimeOffConflictsSection({
  isConflictsLoading,
  conflictMessage,
  affectedBookings,
}: Readonly<Props>) {
  const affectedBookingItems = React.useMemo(
    () =>
      affectedBookings.map((booking) => {
        const bookingDate = new Date(booking.start);
        const dateDay = Number.isNaN(bookingDate.getTime())
          ? '--'
          : bookingDate.toLocaleDateString('en-US', { day: '2-digit' });
        const dateMonth = Number.isNaN(bookingDate.getTime())
          ? '--'
          : bookingDate.toLocaleDateString('en-US', { month: 'short' });

        return {
          id: booking.id,
          dateDay,
          dateMonth,
          time: timeUtils.getTime(String(booking.start)),
          title: booking.title || 'Booking',
          duration: timeUtils.getHumanDuration(booking.duration),
          master: booking.masterName,
          price: `${booking.price} Euro`,
          note: booking.note,
        };
      }),
    [affectedBookings],
  );

  return (
    <>
      {!isConflictsLoading && conflictMessage ? (
        <TimeOffConflictAlert message={conflictMessage} />
      ) : null}

      {!isConflictsLoading && affectedBookingItems.length > 0 ? (
        <div>
          <h2 className='text-lg font-semibold mb-3'>Affected bookings</h2>
          <ul className='max-h-[140px] md:max-h-[270px] overflow-y-auto flex flex-col gap-3 pr-2'>
            {affectedBookingItems.map((item) => (
              <li key={item.id} className='list-none'>
                <HistoryCard
                  dateDay={item.dateDay}
                  dateMonth={item.dateMonth}
                  time={item.time}
                  title={item.title}
                  duration={item.duration}
                  master={item.master}
                  price={item.price}
                  note={item.note}
                />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </>
  );
}
