'use client';
import React, { useMemo } from 'react';
import { Route } from 'next';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';

import { orderHooks } from '@avoo/hooks';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import { useApiStatusStore } from '@avoo/store';

import AppPlaceholder from '@/_components/AppPlaceholder/AppPlaceholder';
import AppWrapper from '@/_components/AppWrapper/AppWrapper';
import OrderControls from '@/_components/OrderControls/OrderControls';
import OrderList from '@/_components/OrderList/OrderList';
import { localizationHooks } from '@/_hooks/localizationHooks';
import AutoStoriesIcon from '@/_icons/AutoStoriesIcon';
import { AppRoutes } from '@/_routes/routes';

export default function OrdersPage() {
  const t = useTranslations('private.orders');
  const isPending = useApiStatusStore((state) => state.isPending);

  const searchParams = useSearchParams();
  const statusParam = searchParams.get('status');

  const status = useMemo(() => {
    if (!statusParam) return undefined;

    return Object.values(OrderStatus).includes(statusParam as OrderStatus)
      ? (statusParam as OrderStatus)
      : undefined;
  }, [statusParam]);

  const { params, queryParams, setOrderStatus, setMasterId, setDateFrom, setDateTo, resetFilters } =
    orderHooks.useOrderQuery(status);

  const { data, fetchNextPage, hasNextPage } = orderHooks.useGetOrdersInfinite(queryParams);
  const orders = useMemo(() => data?.pages.flatMap((page) => page.data?.items ?? []) ?? [], [data]);

  const router = useRouter();
  const pathname = usePathname();

  const handleResetFilters = () => {
    resetFilters();
    router.replace(pathname as Route);
  };

  return (
    <AppWrapper>
      <OrderControls
        setOrderStatus={setOrderStatus}
        setMasterId={setMasterId}
        setDateFrom={setDateFrom}
        setDateTo={setDateTo}
        onResetFilters={handleResetFilters}
        params={params}
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
