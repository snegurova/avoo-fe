import { ScrollView, Switch, Text, View } from 'react-native';

import { Order } from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';
import { customerHooks } from '@avoo/hooks';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import { timeUtils } from '@avoo/shared';

import { Avatar } from '@/shared/Avatar/Avatar';
import { BottomSheetHeader } from '@/shared/BottomSheetHeader/BottomSheetHeader';
import { StatusChip } from '@/shared/StatusChip/StatusChip';

type Props = {
  order: Order;
  endTime: string | null;
  onEdit: () => void;
  onClose: () => void;
};

export const OrderViewContent = ({ order, endTime, onEdit, onClose }: Props) => {
  const notes = typeof order.notes === 'string' ? order.notes : null;
  const customerData = customerHooks.useGetCustomerById(order.customer?.id);
  const lastVisit = customerData?.lastVisit ?? order.customer?.lastVisit;

  return (
    <View className='flex-1'>
      <BottomSheetHeader
        handleClose={onClose}
        handleEdit={order.status === OrderStatus.CONFIRMED ? onEdit : undefined}
      />
      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 24, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className='mb-6'>
          <Text className='text-2xl font-semibold text-gray-900 mb-1'>
            {timeUtils.getHumanDate(order.date)}
          </Text>
          <View className='flex-row items-center' style={{ gap: 8 }}>
            <Text className='text-sm text-gray-600'>
              {timeUtils.getTime(order.date)}
              {endTime ? ` – ${endTime}` : ''}
            </Text>
            <StatusChip status={order.status} />
          </View>
        </View>

        <View className='mb-5'>
          <Text className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-2'>
            Service
          </Text>
          <View className='rounded-lg border border-gray-200 bg-white px-4 py-3 flex-row items-center'>
            <View className='flex-1 mr-3'>
              <Text className='text-sm font-medium text-gray-900 mb-1'>
                {order.service?.name ?? order.combination?.name ?? '—'}
              </Text>
              <Text className='text-xs text-gray-500 mb-2'>
                {timeUtils.getHumanDuration(order.duration)}
              </Text>
              <View className='flex-row items-center' style={{ gap: 6 }}>
                <Avatar
                  uri={order.master?.avatarPreviewUrl}
                  name={order.master?.name}
                  size={20}
                  backgroundColor={colors.primary[300]}
                  textStyle={{ fontSize: 10, lineHeight: 12 }}
                />
                <Text className='text-xs text-gray-600'>{order.master?.name ?? '—'}</Text>
              </View>
            </View>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '400',
                lineHeight: 16,
                letterSpacing: 0.64,
                color: colors.gray[900],
              }}
            >
              €{order.price}
            </Text>
          </View>
        </View>

        <View className='mb-5'>
          <Text className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-2'>
            Client
          </Text>
          <View className='rounded-lg border border-gray-200 bg-white px-4 py-3'>
            <View className='flex-row items-center' style={{ gap: 12 }}>
              <Avatar
                name={order.customer?.name}
                size={40}
                backgroundColor={colors.primary[100]}
                textStyle={{ fontSize: 16, lineHeight: 20 }}
              />
              <View className='flex-1'>
                <Text className='text-sm font-medium text-gray-900'>
                  {order.customer?.name ?? '—'}
                </Text>
                {order.customer?.email ? (
                  <Text className='text-xs text-gray-500 mt-0.5'>{order.customer.email}</Text>
                ) : null}
                {order.customer?.phone ? (
                  <Text className='text-xs text-gray-500 mt-0.5'>{order.customer.phone}</Text>
                ) : null}
                {lastVisit ? (
                  <>
                    <View className='h-[1px] bg-primary-100 mt-3 mb-2' />
                    <Text className='text-xs'>
                      <Text className='text-gray-400'>Last visit </Text>
                      <Text className='text-gray-600'>
                        {timeUtils.formatShortDateLabel(new Date(lastVisit))}
                      </Text>
                    </Text>
                  </>
                ) : null}
              </View>
            </View>
          </View>
        </View>

        {notes ? (
          <View className='mb-5'>
            <Text className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-1'>
              Note
            </Text>
            <Text className='text-sm text-gray-600'>{notes}</Text>
          </View>
        ) : null}

        <View className='flex-row items-center justify-between' style={{ gap: 12 }}>
          <Text className='text-sm text-gray-700 flex-1'>
            Automatically sending appointment information to client via email
          </Text>
          <Switch
            value={order.customer?.isNotificationEnable ?? false}
            disabled
            trackColor={{ true: colors.primary[400] }}
          />
        </View>
      </ScrollView>
    </View>
  );
};
