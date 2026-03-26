import { Pressable, ScrollView, Text, View } from 'react-native';

import { Order } from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import { timeUtils } from '@avoo/shared';

import { StatusChip } from '@/shared/StatusChip/StatusChip';

const STATUS_COLORS: Record<string, string> = {
  [OrderStatus.PENDING]: colors.orange[700],
  [OrderStatus.CONFIRMED]: colors.blue[700],
  [OrderStatus.COMPLETED]: colors.purple[700],
  [OrderStatus.EXPIRED]: colors.red[800],
  [OrderStatus.CANCELED]: colors.red[800],
};

type Props = {
  order: Order;
  endTime: string | null;
  onEdit: () => void;
  onClose: () => void;
};

export const OrderViewContent = ({ order, endTime, onEdit, onClose }: Props) => {
  const notes = typeof order.notes === 'string' ? order.notes : null;
  const statusColor = STATUS_COLORS[order.status] ?? colors.gray[400];

  return (
    <View className='flex-1'>
      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Date + time + status */}
        <View className='mb-6'>
          <Text className='text-2xl font-semibold text-gray-900 mb-1'>
            {timeUtils.getHumanDate(order.date)}
          </Text>
          <View className='flex-row items-center' style={{ gap: 8 }}>
            <Text className='text-sm text-gray-600'>
              {timeUtils.getTime(order.date)}
              {endTime ? ` – ${endTime}` : ''}
            </Text>
            <StatusChip status={order.status} color={statusColor} />
          </View>
        </View>

        {/* Service */}
        <View className='mb-5'>
          <Text className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-2'>
            Service
          </Text>
          <View className='rounded-lg border border-gray-200 bg-white px-4 py-3'>
            <Text className='text-sm font-medium text-gray-900'>
              {order.service?.name ?? order.combination?.name ?? '—'}
            </Text>
            <Text className='text-xs text-gray-500 mt-1'>
              {timeUtils.convertDuration(order.duration)} · {order.master?.name ?? '—'}
            </Text>
          </View>
          {notes ? <Text className='text-xs text-gray-500 mt-2 px-1'>Note: {notes}</Text> : null}
        </View>

        {/* Client */}
        <View className='mb-5'>
          <Text className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-2'>
            Client
          </Text>
          <View className='rounded-lg border border-gray-200 bg-white px-4 py-3'>
            <Text className='text-sm font-medium text-gray-900'>
              {order.customer?.name ?? order.customer?.email ?? '—'}
            </Text>
            {order.customer?.phone ? (
              <Text className='text-xs text-gray-500 mt-1'>{order.customer.phone}</Text>
            ) : null}
            {order.customer?.email && order.customer?.name ? (
              <Text className='text-xs text-gray-500 mt-0.5'>{order.customer.email}</Text>
            ) : null}
          </View>
        </View>
      </ScrollView>

      {/* Footer buttons */}
      <View className='pb-6 pt-3' style={{ gap: 10 }}>
        {order.status === OrderStatus.CONFIRMED && (
          <Pressable
            className='rounded-xl py-4 items-center'
            style={{ backgroundColor: colors.primary[700] }}
            onPress={onEdit}
          >
            <Text className='text-base font-semibold' style={{ color: colors.white }}>
              Edit booking
            </Text>
          </Pressable>
        )}
        <Pressable
          className='rounded-xl py-4 items-center border border-gray-200'
          onPress={onClose}
        >
          <Text className='text-base font-medium text-gray-700'>Close</Text>
        </Pressable>
      </View>
    </View>
  );
};
