import { useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { orderApi } from '@avoo/axios';
import { BaseResponse, Order, UpdateOrderRequest } from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';
import { customerHooks } from '@avoo/hooks';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import { timeUtils } from '@avoo/shared';

import { DurationStepper } from '@/components/DurationStepper/DurationStepper';
import { Avatar } from '@/shared/Avatar/Avatar';
import { BottomSheetHeader } from '@/shared/BottomSheetHeader/BottomSheetHeader';
import { StatusChip } from '@/shared/StatusChip/StatusChip';
import { invalidateOrderQueries } from '@/utils/invalidateOrderQueries';

type Props = {
  order: Order;
  endTime: string | null;
  onClose: () => void;
  refetch: () => void;
};

export const OrderConfirmationContent = ({ order, endTime, onClose, refetch }: Props) => {
  const [notes, setNotes] = useState(typeof order.notes === 'string' ? order.notes : '');
  const [duration, setDuration] = useState(order.duration);
  const customerData = customerHooks.useGetCustomerById(order.customer?.id);
  const lastVisit = customerData?.lastVisit ?? order.customer?.lastVisit;

  const queryClient = useQueryClient();

  const [pendingAction, setPendingAction] = useState<'reject' | 'confirm' | null>(null);

  const { mutate, isPending } = useMutation<BaseResponse<Order>, Error, UpdateOrderRequest>({
    mutationFn: (data) => orderApi.updateOrder(order.id, data),
    onSuccess: async () => {
      await invalidateOrderQueries(queryClient);
      refetch();
      onClose();
    },
    onSettled: () => setPendingAction(null),
  });

  const handleReject = () => {
    setPendingAction('reject');
    mutate({ status: OrderStatus.CANCELED, notes: notes.trim() || undefined, duration });
  };

  const handleConfirm = () => {
    setPendingAction('confirm');
    mutate({ status: OrderStatus.CONFIRMED, notes: notes.trim() || undefined, duration });
  };

  return (
    <View className='flex-1'>
      <BottomSheetHeader handleClose={onClose} />
      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 16, paddingHorizontal: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
      >
        <View className='mb-6'>
          <View className='flex-row items-start justify-between'>
            <Text className='text-2xl font-semibold text-gray-900 mb-1'>
              {timeUtils.getHumanDate(order.date)}
            </Text>
            {order.createdAt ? (
              <Text className='text-sm text-gray-400 mt-1'>
                {timeUtils.getTimeAgo(order.createdAt)}
              </Text>
            ) : null}
          </View>
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
          <Text className='text-sm font-medium text-gray-900 mb-2'>Service duration</Text>
          <DurationStepper value={duration} onChange={setDuration} />
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

        <View className='mb-4'>
          <Text className='text-sm font-medium text-gray-900 mb-2'>Note (optional)</Text>
          <TextInput
            className='rounded-lg bg-white border border-gray-200 px-4 py-3 text-sm text-gray-900'
            style={{ minHeight: 72, textAlignVertical: 'top' }}
            placeholder='Add a note...'
            placeholderTextColor={colors.gray[400]}
            multiline
            maxLength={200}
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        <View className='flex-row items-center justify-between' style={{ gap: 12 }}>
          <Text className='text-sm text-gray-700 flex-1'>
            Automatically sending appointment information to client via email
          </Text>
          <Switch
            value={order.customer?.isNotificationEnable ?? false}
            trackColor={{ true: colors.gray[900], false: colors.gray[300] }}
          />
        </View>
      </ScrollView>

      <View className='pb-6 pt-3 px-5 flex-row' style={{ gap: 12 }}>
        <Pressable
          style={{
            flex: 1,
            height: 44,
            borderRadius: 8,
            borderWidth: 1,
            borderColor: colors.gray[900],
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={handleReject}
          disabled={isPending}
        >
          {pendingAction === 'reject' ? (
            <ActivityIndicator color={colors.gray[900]} />
          ) : (
            <Text className='text-base font-semibold text-gray-900'>Reject</Text>
          )}
        </Pressable>
        <Pressable
          style={{
            flex: 1,
            height: 44,
            borderRadius: 8,
            backgroundColor: colors.gray[900],
            alignItems: 'center',
            justifyContent: 'center',
          }}
          onPress={handleConfirm}
          disabled={isPending}
        >
          {pendingAction === 'confirm' ? (
            <ActivityIndicator color={colors.white} />
          ) : (
            <Text className='text-base font-semibold' style={{ color: colors.white }}>
              Confirm
            </Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};
