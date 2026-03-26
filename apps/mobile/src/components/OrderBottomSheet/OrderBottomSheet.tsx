import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import { orderHooks } from '@avoo/hooks';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import { timeUtils } from '@avoo/shared';

import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';

import { OrderConfirmationContent } from './OrderConfirmationContent';
import { OrderEditContent } from './OrderEditContent';
import { OrderViewContent } from './OrderViewContent';

enum Mode {
  View = 'View',
  Edit = 'Edit',
  Confirmation = 'Confirmation',
}

type Props = {
  visible: boolean;
  onClose: () => void;
  orderId: number | null;
};

export const OrderBottomSheet = ({ visible, onClose, orderId }: Props) => {
  const [mode, setMode] = useState<Mode>(Mode.View);
  const { data: order, refetch } = orderHooks.useGetOrderById(orderId ?? 0);

  useEffect(() => {
    if (!order) return;
    setMode(order.status === OrderStatus.PENDING ? Mode.Confirmation : Mode.View);
  }, [orderId, order?.status]);

  const endTime = useMemo(
    () => (order ? timeUtils.getEndTime(order.date, order.duration) : null),
    [order],
  );

  return (
    <CustomBottomSheet visible={visible} onClose={onClose}>
      {!order ? (
        <View className='py-10 items-center'>
          <ActivityIndicator />
        </View>
      ) : (
        <View className='flex-1 px-5'>
          {mode === Mode.View && (
            <OrderViewContent
              order={order}
              endTime={endTime}
              onEdit={() => setMode(Mode.Edit)}
              onClose={onClose}
            />
          )}
          {mode === Mode.Confirmation && (
            <OrderConfirmationContent
              order={order}
              endTime={endTime}
              onClose={onClose}
              refetch={refetch}
            />
          )}
          {mode === Mode.Edit && (
            <OrderEditContent order={order} onClose={() => setMode(Mode.View)} refetch={refetch} />
          )}
        </View>
      )}
    </CustomBottomSheet>
  );
};
