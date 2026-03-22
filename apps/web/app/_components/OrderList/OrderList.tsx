import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';

import { Typography } from '@mui/material';

import { Order } from '@avoo/axios/types/apiTypes';
import { useApiStatusStore } from '@avoo/store';

import AsideModal from '@/_components/AsideModal/AsideModal';
import OrderData, { Mode } from '@/_components/OrderData/OrderData';
import OrderListItem from '@/_components/OrderListItem/OrderListItem';

type Props = {
  orders: Order[];
  incrementPage: () => void;
  hasMore: boolean;
};

export default function OrderList(props: Props) {
  const t = useTranslations('private.components.OrderList.OrderList');
  const { orders, incrementPage, hasMore } = props;

  const listRef = useRef<HTMLDivElement>(null);

  const isPending = useApiStatusStore((state) => state.isPending);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  useEffect(() => {
    const el = listRef.current;
    if (!el || !hasMore) return;
    if (el.scrollHeight <= el.clientHeight) {
      incrementPage();
    }
  }, [orders?.length, hasMore]);

  return (
    <>
      <div className='flex flex-col gap-6 overflow-y-hidden max-h-[calc(100vh-200px)]'>
        <div
          className='flex flex-col overflow-y-auto gap-4 max-h-[70vh]'
          ref={listRef}
          onScroll={(e) => {
            const el = e.currentTarget;
            if (el.scrollHeight - el.scrollTop <= el.clientHeight + 1 && hasMore) {
              incrementPage();
            }
          }}
        >
          <ul className='flex flex-col gap-2 mb-10'>
            {orders && orders.length !== 0 ? (
              orders.map((order) => (
                <li key={order.id} onClick={() => setSelectedOrder(order)}>
                  <OrderListItem
                    id={order.id}
                    name={order.name}
                    date={order.date}
                    client={order.customer}
                    status={order.status}
                    master={order.master}
                    isSelected={false}
                  />
                </li>
              ))
            ) : isPending ? (
              <Typography variant='h1'>{t('loading')}</Typography>
            ) : (
              <Typography variant='h1'>{t('noOrdersFound')}</Typography>
            )}
          </ul>
        </div>
      </div>
      <AsideModal open={!!selectedOrder} handleClose={() => setSelectedOrder(null)}>
        {selectedOrder && (
          <OrderData
            orderId={selectedOrder.id}
            onClose={() => setSelectedOrder(null)}
            refetchCalendar={() => {}}
            isOutOfSchedule={false}
            initialMode={Mode.View}
          />
        )}
      </AsideModal>
    </>
  );
}
