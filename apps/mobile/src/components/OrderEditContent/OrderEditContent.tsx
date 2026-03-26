import { useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { orderApi } from '@avoo/axios';
import {
  BaseResponse,
  MasterWithRelationsEntity,
  Order,
  UpdateOrderRequest,
} from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';
import { timeUtils } from '@avoo/shared';

import { DatePickerSheet } from '@/components/DatePickerSheet/DatePickerSheet';
import { DurationStepper } from '@/components/DurationStepper/DurationStepper';
import { LockedField } from '@/components/LockedField/LockedField';
import { MastersSheet } from '@/components/MastersSheet/MastersSheet';
import { TimeSlotChips } from '@/components/TimeSlotChips/TimeSlotChips';
import { calendarMobileHooks } from '@/hooks/calendarHooks';
import { masterMobileHooks } from '@/hooks/masterHooks';
import { uiHooks } from '@/hooks/uiHooks';
import { FormField } from '@/shared/FormField';
import { NotesInput } from '@/shared/NotesInput';

type Props = {
  order: Order;
  onClose: () => void;
  refetch: () => void;
};

export const OrderEditContent = ({ order, onClose, refetch }: Props) => {
  const [notes, setNotes] = useState(typeof order.notes === 'string' ? order.notes : '');
  const [duration, setDuration] = useState(order.duration);
  const [selectedMaster, setSelectedMaster] = useState<MasterWithRelationsEntity>(order.master);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(order.date);
  const [isMasterPickerVisible, setMasterPickerVisible] = useState(false);

  const {
    tempDate,
    setTempDate,
    isVisible: isDatePickerVisible,
    open: openDatePicker,
    close: closeDatePicker,
    confirm: confirmDate,
    dateStr,
    dateLabel,
  } = uiHooks.useDatePicker(new Date(order.date), () => setSelectedSlot(null));

  const { masters } = masterMobileHooks.useGetMastersFlattened({
    serviceId: order.service?.id,
    combinationId: order.combination?.id,
    limit: 50,
  });

  const { slots, isLoading: isSlotsLoading } = calendarMobileHooks.useGetAvailableSlots(
    {
      serviceId: order.service?.id,
      masterIds: [selectedMaster.id],
      date: dateStr,
      duration,
    },
    { enabled: !!order.service?.id },
  );

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

  const handleSave = () => {
    if (!selectedSlot) return;
    mutate({
      notes: notes.trim() || undefined,
      duration,
      masterId: selectedMaster.id,
      date: timeUtils.convertLocalToUTC(selectedSlot),
    });
  };

  const handleMasterSelect = (ids: number[]) => {
    const currentId = selectedMaster.id;
    const newId = ids.find((id) => id !== currentId) ?? ids[0];
    const master = masters.find((m) => m.id === newId);
    if (master) {
      setSelectedMaster(master);
      setSelectedSlot(null);
    }
    setMasterPickerVisible(false);
  };

  return (
    <>
      <MastersSheet
        visible={isMasterPickerVisible}
        onClose={() => setMasterPickerVisible(false)}
        masters={masters}
        selectedMasterIds={[selectedMaster.id]}
        onSelect={handleMasterSelect}
      />

      {isDatePickerVisible && (
        <DatePickerSheet
          value={tempDate}
          onClose={closeDatePicker}
          onConfirm={confirmDate}
          onChange={(_, date) => {
            if (date) setTempDate(date);
          }}
        />
      )}

      <View className='flex-1'>
        <ScrollView
          className='flex-1'
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
        >
          <Text className='text-2xl font-semibold text-gray-900 mb-6'>Edit booking</Text>

          <View className='mb-4'>
            <Text className='text-xs font-medium text-gray-500 uppercase tracking-wide mb-2'>
              Service
            </Text>
            <View className='rounded-lg border border-gray-200 bg-gray-50 px-4 py-3'>
              <Text className='text-sm font-medium text-gray-900'>
                {order.service?.name ?? order.combination?.name ?? '—'}
              </Text>
            </View>
          </View>

          <FormField label='Notes'>
            <NotesInput value={notes} onChangeText={setNotes} maxLength={200} />
          </FormField>

          <FormField label='Duration'>
            <DurationStepper value={duration} onChange={setDuration} />
          </FormField>

          <FormField label='Master'>
            <LockedField
              value={selectedMaster.name ?? 'Select master'}
              onPress={() => setMasterPickerVisible(true)}
            />
          </FormField>

          <FormField label='Date'>
            <LockedField value={dateLabel} onPress={openDatePicker} />
          </FormField>

          <FormField label='Available time'>
            <TimeSlotChips
              slots={slots}
              selected={selectedSlot}
              onSelect={setSelectedSlot}
              isLoading={isSlotsLoading}
              enabled={!!order.service?.id}
            />
          </FormField>
        </ScrollView>

        <View className='pb-6 pt-3 flex-row' style={{ gap: 12 }}>
          <Pressable
            className='flex-1 rounded-xl py-4 items-center border border-gray-200'
            onPress={onClose}
            disabled={isPending}
          >
            <Text className='text-base font-medium text-gray-700'>Cancel</Text>
          </Pressable>
          <Pressable
            className='flex-1 rounded-xl py-4 items-center'
            style={{ backgroundColor: selectedSlot ? colors.primary[700] : colors.gray[200] }}
            onPress={handleSave}
            disabled={!selectedSlot || isPending}
          >
            {isPending ? (
              <ActivityIndicator color={colors.white} />
            ) : (
              <Text
                className='text-base font-semibold'
                style={{ color: selectedSlot ? colors.white : colors.gray[400] }}
              >
                Save
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </>
  );
};
