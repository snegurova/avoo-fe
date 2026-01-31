import React, { useEffect, useMemo, useState } from 'react';
import { orderHooks } from '@avoo/hooks';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import OrderView from '@/_components/OrderView/OrderView';
import OrderEdit from '@/_components/OrderEdit/OrderEdit';
import OrderConfirmation from '@/_components/OrderConfirmation/OrderConfirmation';
import { useIntervalAction } from '@avoo/hooks';
import { timeUtils } from '@avoo/shared';

dayjs.extend(relativeTime);

type Props = {
  orderId: number;
  onClose: () => void;
  refetchCalendar: () => void;
};

enum Mode {
  View = 'View',
  Edit = 'Edit',
  Confirmation = 'Confirmation',
}

export default function OrderData(props: Props) {
  const { orderId, onClose, refetchCalendar } = props;
  const [mode, setMode] = useState<Mode>(Mode.View);
  const { data: order, refetch } = orderHooks.useGetOrderById(orderId);
  const [timeAgo, setTimeAgo] = React.useState<string>('');

  useEffect(() => {
    if (!order) return;

    if (order.status === OrderStatus.PENDING) {
      setMode(Mode.Confirmation);
    } else {
      setMode(Mode.View);
    }
  }, [orderId, order]);

  const endTime = useMemo(
    () =>
      order && order.service
        ? timeUtils.getMinutesInDay(order.date) + order.service.durationMinutes
        : null,
    [order],
  );

  useIntervalAction(() => {
    if (!order) return;
    setTimeAgo(dayjs(order.createdAt).fromNow());
  });

  const onEdit = () => {
    setMode(Mode.Edit);
  };

  return (
    <>
      {order && (
        <div className='overflow-y-auto overflow-x-hidden h-full'>
          {mode === Mode.View && (
            <OrderView order={order} onEdit={onEdit} timeAgo={timeAgo} endTime={endTime} />
          )}
          {mode === Mode.Edit && (
            <OrderEdit
              order={order}
              onClose={onClose}
              refetchCalendar={refetchCalendar}
              refetchOrder={refetch}
            />
          )}
          {mode === Mode.Confirmation && (
            <OrderConfirmation
              order={order}
              timeAgo={timeAgo}
              endTime={endTime}
              onClose={onClose}
              refetchCalendar={refetchCalendar}
              refetchOrder={refetch}
            />
          )}
        </div>
      )}
    </>
  );
}
