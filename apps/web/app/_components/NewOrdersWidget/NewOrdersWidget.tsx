'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { orderHooks } from '@avoo/hooks';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';

import OrderListItem from '@/_components/OrderListItem/OrderListItem';
import { localizationHooks } from '@/_hooks/localizationHooks';
import ArrowForwardIcon from '@/_icons/ArrowForwardIcon';
import { AppRoutes } from '@/_routes/routes';

export default function NewOrdersWidget() {
  const t = useTranslations('private.components.NewOrdersWidget.NewOrdersWidget');

  const dateFrom = useMemo(() => new Date().toISOString(), []);

  const { data } = orderHooks.useGetOrdersInfinite({
    dateFrom,
    limit: 2,
    status: OrderStatus.PENDING,
  });
  const orders = useMemo(() => data?.pages.flatMap((page) => page.data?.items ?? []) ?? [], [data]);
  const ordersLink = localizationHooks.useWithLocale(AppRoutes.Orders);

  return orders.length === 0 ? (
    <div className='px-4 pb-5 pt-1 md:px-5'>
      <div className='flex min-h-[170px] flex-col items-center justify-center rounded-lg border border-gray-200 px-6 text-center'>
        <p className='text-base font-semibold text-black'>{t('noOrders')}</p>
        <p className='mt-2 text-xs text-gray-500'>{t('noOrdersHint')}</p>
      </div>
    </div>
  ) : (
    <>
      <div className='px-4 py-2 flex gap-2 flex-col'>
        {orders.map((order) => (
          <OrderListItem
            key={order.id}
            id={order.id}
            name={order.name}
            date={order.date}
            client={order.customer}
            status={order.status}
            master={order.master}
            hideClientName
          />
        ))}
      </div>
      <div className='flex justify-end px-4 py-2'>
        <Link
          href={{
            pathname: ordersLink,
            query: { status: OrderStatus.PENDING },
          }}
          className='inline-flex h-[34px] items-center gap-2 rounded-full border border-gray-200 px-4 py-2 text-sm leading-none text-gray-800 transition-colors hover:bg-primary-100 disabled:cursor-not-allowed disabled:opacity-50'
        >
          <span>{t('seeAll')}</span>
          <ArrowForwardIcon className='h-3.5 w-3.5 fill-gray-800' />
        </Link>
      </div>
    </>
  );
}
