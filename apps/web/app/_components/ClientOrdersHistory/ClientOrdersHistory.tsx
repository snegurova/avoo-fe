'use client';

import React from 'react';
import { useLocale, useTranslations } from 'next-intl';

import { Order } from '@avoo/axios/types/apiTypes';
import { orderHooks } from '@avoo/hooks';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import { timeUtils } from '@avoo/shared';

import { CURRENCY } from '@/_constants/currency';
import {
  formatLocalizedCurrency,
  formatLocalizedDuration,
  getLocalizedDayMonthParts,
} from '@/_utils/intlFormatters';

import HistoryCard from '../HistoryCard/HistoryCard';

type Props = {
  customerId: number | null;
};

type HistoryItem = {
  id: number;
  dateDay: string;
  dateMonth: string;
  time: string;
  title: string;
  duration: string;
  master: string;
  masterAvatarUrl?: string | null;
  price: string;
  note?: string;
};

export default function ClientOrdersHistory(props: Readonly<Props>) {
  const t = useTranslations('private.components.ClientOrdersHistory.ClientOrdersHistory');
  const locale = useLocale();
  const { customerId } = props;
  const customerOrders = orderHooks.useGetCustomerOrderHistory(customerId, 50);

  const mapOrderToHistoryItem = React.useCallback(
    (order: Order): HistoryItem => {
      const { day: dateDay, month: dateMonth } = getLocalizedDayMonthParts(order.date, locale);
      const title =
        order.service?.name ?? order.combination?.name ?? order.name ?? t('bookingFallback');
      const note = typeof order.notes === 'string' ? order.notes : undefined;
      const masterAvatarUrl = order.master?.avatarPreviewUrl ?? order.master?.avatarUrl ?? null;

      return {
        id: order.id,
        dateDay,
        dateMonth,
        time: timeUtils.getTime(String(order.date)),
        title,
        duration: formatLocalizedDuration(order.duration, locale),
        master: order.master?.name ?? t('anyMaster'),
        masterAvatarUrl,
        price: formatLocalizedCurrency(order.price, CURRENCY, locale, 'name'),
        note,
      };
    },
    [locale, t],
  );

  const { nextAppointments, historyItems } = React.useMemo(() => {
    const now = Date.now();
    const nextAppointmentStatuses = new Set([OrderStatus.PENDING, OrderStatus.CONFIRMED]);
    const sorted = [...customerOrders].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    );

    const upcoming = sorted
      .filter((order) => {
        const timestamp = new Date(order.date).getTime();
        return (
          Number.isFinite(timestamp) &&
          timestamp >= now &&
          nextAppointmentStatuses.has(order.status)
        );
      })
      .map(mapOrderToHistoryItem);

    const history = sorted
      .filter((order) => {
        const timestamp = new Date(order.date).getTime();
        return (
          Number.isFinite(timestamp) && timestamp < now && order.status === OrderStatus.COMPLETED
        );
      })
      .reverse()
      .map(mapOrderToHistoryItem);

    return {
      nextAppointments: upcoming,
      historyItems: history,
    };
  }, [customerOrders, mapOrderToHistoryItem]);

  return (
    <>
      <div>
        <h2 className='text-lg font-semibold mb-3'>{t('nextAppointment')}</h2>
        {nextAppointments.length > 0 ? (
          <ul className='max-h-[140px] md:max-h-[270px] overflow-y-auto flex flex-col gap-3 pr-2'>
            {nextAppointments.map((item) => (
              <li key={item.id} className='list-none'>
                <HistoryCard
                  dateDay={item.dateDay}
                  dateMonth={item.dateMonth}
                  time={item.time}
                  title={item.title}
                  duration={item.duration}
                  master={item.master}
                  masterAvatarUrl={item.masterAvatarUrl}
                  price={item.price}
                  note={item.note}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className='text-center py-6'>
            <p className='text-[16px] font-semibold text-slate-900'>{t('noUpcomingAppt')}</p>
            <p className='text-[12px] text-slate-500 mt-2'>{t('upcomingVisitsHint')}</p>
          </div>
        )}
      </div>

      <div>
        <h2 className='text-lg font-semibold mb-3'>{t('history')}</h2>
        {historyItems.length > 0 ? (
          <ul className='max-h-[140px] md:max-h-[270px] overflow-y-auto flex flex-col gap-3 pr-2'>
            {historyItems.map((item) => (
              <li key={item.id} className='list-none'>
                <HistoryCard
                  dateDay={item.dateDay}
                  dateMonth={item.dateMonth}
                  time={item.time}
                  title={item.title}
                  duration={item.duration}
                  master={item.master}
                  masterAvatarUrl={item.masterAvatarUrl}
                  price={item.price}
                  note={item.note}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className='text-center py-6'>
            <p className='text-[16px] font-semibold text-slate-900'>{t('noPrevAppt')}</p>
            <p className='text-[12px] text-slate-500 mt-2'>{t('historyHint')}</p>
          </div>
        )}
      </div>
    </>
  );
}
