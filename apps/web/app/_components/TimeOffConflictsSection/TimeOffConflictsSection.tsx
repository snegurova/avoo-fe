'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';

import type { AffectedBooking } from '@avoo/hooks/types/timeOffType';
import { timeUtils } from '@avoo/shared';

import { CURRENCY } from '@/_constants/currency';
import {
  formatLocalizedCurrency,
  formatLocalizedDuration,
  getLocalizedDayMonthParts,
} from '@/_utils/intlFormatters';

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
  const locale = useLocale();
  const t = useTranslations('private.components.TimeOffConflictsSection.TimeOffConflictsSection');
  const affectedBookingItems = React.useMemo(
    () =>
      affectedBookings.map((booking) => {
        const { day: dateDay, month: dateMonth } = getLocalizedDayMonthParts(booking.start, locale);

        return {
          id: booking.id,
          dateDay,
          dateMonth,
          time: timeUtils.getTime(String(booking.start)),
          title: booking.title || t('bookingFallback'),
          duration: formatLocalizedDuration(booking.duration, locale),
          master: booking.masterName,
          price: formatLocalizedCurrency(booking.price, CURRENCY, locale, 'name'),
          note: booking.note,
        };
      }),
    [affectedBookings, locale, t],
  );

  return (
    <>
      {!isConflictsLoading && conflictMessage ? (
        <TimeOffConflictAlert message={conflictMessage} />
      ) : null}

      {!isConflictsLoading && affectedBookingItems.length > 0 ? (
        <div>
          <h2 className='text-lg font-semibold mb-3'>{t('affectedBookings')}</h2>
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
