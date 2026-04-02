import { useMemo, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { Text } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';

import { colors } from '@avoo/design-tokens';
import { orderHooks } from '@avoo/hooks';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import { timeUtils } from '@avoo/shared';

import { ActionPillButton } from '@/shared/ActionPillButton/ActionPillButton';
import { RootNavigationProp, RootScreens } from '@/types/navigation';

import { NotificationItem } from '../NotificationItem/NotificationItem';
import { OrderBottomSheet } from '../OrderBottomSheet/OrderBottomSheet';

export const NotificationsSection = () => {
  const navigation = useNavigation<RootNavigationProp>();
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const dateFrom = useMemo(() => new Date().toISOString(), []);
  const orders = orderHooks.useGetOrders({
    page: 1,
    limit: 5,
    status: OrderStatus.PENDING,
    dateFrom,
  });

  const notifications = useMemo(
    () =>
      (orders ?? []).map((order) => ({
        id: String(order.id),
        time: timeUtils.getTime(order.date),
        date: new Date(order.date).toLocaleDateString('en-US', {
          weekday: 'short',
          day: 'numeric',
          month: 'short',
        }),
        service: order.service?.name ?? order.combination?.name ?? '—',
        clientPhone: order.customer?.phone ?? order.customer?.email ?? '—',
        timeAgo: timeUtils.getTimeAgo(order.createdAt),
        master: order.master?.name ?? '—',
      })),
    [orders],
  );

  return (
    <>
      <OrderBottomSheet
        visible={selectedOrderId !== null}
        onClose={() => setSelectedOrderId(null)}
        orderId={selectedOrderId}
      />
      <View className='bg-white rounded-2xl p-4 border border-gray-200'>
        <Text variant='titleLarge' className='mb-4'>
          New orders
        </Text>

        {orders === undefined ? (
          <View className='py-6 items-center'>
            <ActivityIndicator color={colors.primary[700]} />
          </View>
        ) : notifications.length === 0 ? (
          <View className='rounded-lg border border-gray-200 px-6 py-10 items-center justify-center'>
            <Text variant='titleMedium' style={{ textAlign: 'center', marginBottom: 8 }}>
              No new orders
            </Text>
            <Text variant='bodySmall' style={{ color: colors.gray[500], textAlign: 'center' }}>
              New orders will appear here when they are created.
            </Text>
          </View>
        ) : (
          <View className='gap-3'>
            {notifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                notification={notification}
                onPress={() => setSelectedOrderId(Number(notification.id))}
              />
            ))}
          </View>
        )}

        <ActionPillButton
          label='See all'
          className='mt-5'
          onPress={() =>
            navigation.navigate(RootScreens.OrdersScreen, { initialStatus: OrderStatus.PENDING })
          }
        />
      </View>
    </>
  );
};
