'use client';

import React from 'react';

import { Order } from '@avoo/axios/types/apiTypes';
import { orderHooks } from '@avoo/hooks';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import { timeUtils } from '@avoo/shared';

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
  price: string;
  note?: string;
};

export default function ClientOrdersHistory(props: Readonly<Props>) {
  const { customerId } = props;
  const customerOrders = orderHooks.useGetCustomerOrderHistory(customerId, 50);

  const mapOrderToHistoryItem = React.useCallback((order: Order): HistoryItem => {
    const orderDate = new Date(order.date);
    const dateDay = Number.isNaN(orderDate.getTime())
      ? '--'
      : orderDate.toLocaleDateString('en-US', { day: '2-digit' });
    const dateMonth = Number.isNaN(orderDate.getTime())
      ? '--'
      : orderDate.toLocaleDateString('en-US', { month: 'short' });
    const title = order.service?.name ?? order.combination?.name ?? order.name ?? 'Booking';
    const note = typeof order.notes === 'string' ? order.notes : undefined;

    return {
      id: order.id,
      dateDay,
      dateMonth,
      time: timeUtils.getTime(String(order.date)),
      title,
      duration: timeUtils.getHumanDuration(order.duration),
      master: order.master?.name ?? 'Unknown master',
      price: `${order.price} Euro`,
      note,
    };
  }, []);

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
        <h2 className='text-lg font-semibold mb-3'>Next appointment</h2>
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
                  price={item.price}
                  note={item.note}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className='text-center py-6'>
            <p className='text-[16px] font-semibold text-slate-900'>No upcoming appointments</p>
            <p className='text-[12px] text-slate-500 mt-2'>
              Upcoming visits will appear after booking confirmation.
            </p>
          </div>
        )}
      </div>

      <div>
        <h2 className='text-lg font-semibold mb-3'>History</h2>
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
                  price={item.price}
                  note={item.note}
                />
              </li>
            ))}
          </ul>
        ) : (
          <div className='text-center py-6'>
            <p className='text-[16px] font-semibold text-slate-900'>No previous appointments</p>
            <p className='text-[12px] text-slate-500 mt-2'>
              History will show after the first completed visit.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
