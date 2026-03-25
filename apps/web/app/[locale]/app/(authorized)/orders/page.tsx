'use client';
import React, { useMemo } from 'react';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

import { orderHooks } from '@avoo/hooks';
import { useApiStatusStore } from '@avoo/store';

import AppPlaceholder from '@/_components/AppPlaceholder/AppPlaceholder';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import OrderControls from '@/_components/OrderControls/OrderControls';
import OrderList from '@/_components/OrderList/OrderList';
import { localizationHooks } from '@/_hooks/localizationHooks';
import AutoStoriesIcon from '@/_icons/AutoStoriesIcon';
import { AppRoutes } from '@/_routes/routes';

export default function OrdersPage() {
  const isPending = useApiStatusStore((state) => state.isPending);
  const { params, queryParams, setOrderStatus, setMasterId, setDateFrom, setDateTo, resetFilters } =
    orderHooks.useOrderQuery();
  const t = useTranslations('private.orders');

  const { data, fetchNextPage, hasNextPage } = orderHooks.useGetOrdersInfinite(queryParams);
  const total = data?.pages[0]?.data?.pagination?.total ?? 0;
  const orders = useMemo(() => data?.pages.flatMap((page) => page.data?.items ?? []) ?? [], [data]);

  return (
    <AppWrapper>
      <OrderControls
        setOrderStatus={setOrderStatus}
        setMasterId={setMasterId}
        setDateFrom={setDateFrom}
        setDateTo={setDateTo}
        onResetFilters={resetFilters}
        params={params}
        total={total}
      />
      {orders.length === 0 ? (
        <AppPlaceholder
          title={isPending ? t('loading') : t('noOrdersFound')}
          icon={<AutoStoriesIcon className='w-20 h-20 xl:w-25 xl:h-25 fill-primary-300' />}
          description={
            isPending ? null : (
              <p>
                {t.rich('detailedNoOrdersDescription', {
                  link: (chunks) => (
                    <Link
                      href={localizationHooks.useWithLocale(AppRoutes.OrderCreate)}
                      className='text-primary-300'
                    >
                      {chunks}
                    </Link>
                  ),
                })}
              </p>
            )
          }
        />
      ) : (
        <OrderList orders={orders} incrementPage={fetchNextPage} hasMore={hasNextPage} />
      )}
    </AppWrapper>
  );
}
