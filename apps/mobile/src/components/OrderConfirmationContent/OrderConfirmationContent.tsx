import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, TextInput, View } from 'react-native';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { orderApi } from '@avoo/axios';
import { BaseResponse, Order, UpdateOrderRequest } from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';
import { OrderStatus } from '@avoo/hooks/types/orderStatus';
import { timeUtils } from '@avoo/shared';

import { DurationStepper } from '@/components/DurationStepper/DurationStepper';
import { StatusChip } from '@/shared/StatusChip/StatusChip';

type Props = {
  order: Order;
  endTime: string | null;
  onClose: () => void;
  refetch: () => void;
};

export const OrderConfirmationContent = ({ order, endTime, onClose, refetch }: Props) => {
  const [notes, setNotes] = useState(typeof order.notes === 'string' ? order.notes : '');
  const [duration, setDuration] = useState(order.duration);

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation<BaseResponse<Order>, Error, UpdateOrderRequest>({
    mutationFn: (data) => orderApi.updateOrder(order.id, data),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['calendar'] });
      await queryClient.invalidateQueries({ queryKey: ['monthCalendar'] });
      await queryClient.invalidateQueries({ queryKey: ['orders'] });
      refetch();
      onClose();
    },
  });

  const handleReject = () => {
    mutate({ status: OrderStatus.CANCELED, notes: notes.trim() || undefined, duration });
  };

  const handleConfirm = () => {
    mutate({ status: OrderStatus.CONFIRMED, notes: notes.trim() || undefined, duration });
  };

  return (
    <View className='flex-1'>
      <ScrollView
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps='handled'
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
            <StatusChip status={order.status} color={colors.orange[700]} />
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
            <Text className='text-xs text-gray-500 mt-1'>{order.master?.name ?? '—'}</Text>
          </View>
        </View>

        {/* Notes */}
        <View className='mb-4'>
          <Text className='text-sm font-medium text-gray-900 mb-2'>Notes</Text>
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

        {/* Duration */}
        <View className='mb-5'>
          <Text className='text-sm font-medium text-gray-900 mb-2'>Duration</Text>
          <DurationStepper value={duration} onChange={setDuration} />
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
          </View>
        </View>
      </ScrollView>

      {/* Footer: Reject + Confirm */}
      <View className='pb-6 pt-3 flex-row' style={{ gap: 12 }}>
        <Pressable
          className='flex-1 rounded-xl py-4 items-center border border-gray-200'
          onPress={handleReject}
          disabled={isPending}
        >
          {isPending ? (
            <ActivityIndicator color={colors.gray[600]} />
          ) : (
            <Text className='text-base font-semibold text-gray-700'>Reject</Text>
          )}
        </Pressable>
        <Pressable
          className='flex-1 rounded-xl py-4 items-center'
          style={{ backgroundColor: colors.primary[700] }}
          onPress={handleConfirm}
          disabled={isPending}
        >
          {isPending ? (
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
