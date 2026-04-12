import { useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

import { useMutation, useQueryClient } from '@tanstack/react-query';

import { orderApi } from '@avoo/axios';
import {
  BaseResponse,
  MasterWithRelationsEntity,
  Order,
  UpdateOrderRequest,
} from '@avoo/axios/types/apiTypes';
import { colors } from '@avoo/design-tokens';
import { orderHooks } from '@avoo/hooks';
import { timeUtils } from '@avoo/shared';

import { DatePickerSheet } from '@/components/DatePickerSheet/DatePickerSheet';
import { DurationStepper } from '@/components/DurationStepper/DurationStepper';
import { LockedField } from '@/components/LockedField/LockedField';
import { MastersSheet } from '@/components/MastersSheet/MastersSheet';
import { TimeSlotChips } from '@/components/TimeSlotChips/TimeSlotChips';
import { calendarMobileHooks } from '@/hooks/calendarHooks';
import { masterMobileHooks } from '@/hooks/masterHooks';
import { uiHooks } from '@/hooks/uiHooks';
import { BottomSheetHeader } from '@/shared/BottomSheetHeader/BottomSheetHeader';
import { ConfirmModal } from '@/shared/ConfirmModal/ConfirmModal';
import { FormField } from '@/shared/FormField';
import { NotesInput } from '@/shared/NotesInput';
import { invalidateOrderQueries } from '@/utils/invalidateOrderQueries';

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
  const [overlapModal, setOverlapModal] = useState<{ visible: boolean; description: string }>({
    visible: false,
    description: '',
  });

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

  const customerId = order.customer?.id ?? null;
  const customerOrders = orderHooks.useGetCustomerOrderHistory(customerId, 200);

  const { mutate, isPending } = useMutation<BaseResponse<Order>, Error, UpdateOrderRequest>({
    mutationFn: (data) => orderApi.updateOrder(order.id, data),
    onSuccess: async () => {
      await invalidateOrderQueries(queryClient);
      refetch();
      onClose();
    },
  });

  const doSave = () => {
    if (!selectedSlot) return;
    mutate({
      notes: notes.trim() || undefined,
      duration,
      masterId: selectedMaster.id,
      date: timeUtils.convertLocalToUTC(selectedSlot),
    });
  };

  const handleSave = () => {
    if (!selectedSlot) return;

    const newStart = new Date(selectedSlot).getTime();
    const newEnd = newStart + duration * 60_000;

    const overlapping = (customerOrders ?? []).filter((o) => {
      if (o.id === order.id) return false;
      if (!['PENDING', 'CONFIRMED'].includes(o.status)) return false;
      const oStart = new Date(o.date).getTime();
      const oEnd = oStart + o.duration * 60_000;
      return newStart < oEnd && newEnd > oStart;
    });

    if (overlapping.length > 0) {
      const clientName = order.customer?.name ?? order.customer?.email ?? 'this client';
      const conflictList = overlapping
        .map((o) => {
          const svcName = o.service?.name ?? o.combination?.name ?? 'another service';
          const t = timeUtils.getTime(o.date);
          return `"${svcName}" at ${t}`;
        })
        .join(', ');

      setOverlapModal({
        visible: true,
        description: `Changing this booking will cause a time overlap for ${clientName} with: ${conflictList}. Do you want to proceed anyway?`,
      });
      return;
    }

    doSave();
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
      <ConfirmModal
        visible={overlapModal.visible}
        onClose={() => setOverlapModal({ visible: false, description: '' })}
        title='Time overlap'
        description={overlapModal.description}
        onConfirmText='Proceed'
        onCancelText='Cancel'
        onConfirm={doSave}
      />

      <MastersSheet
        visible={isMasterPickerVisible}
        onClose={() => setMasterPickerVisible(false)}
        masters={masters}
        selectedMasterIds={[selectedMaster.id]}
        onSelect={handleMasterSelect}
        hideAllMasters
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

      <BottomSheetHeader
        handleClose={onClose}
        handleConfirm={selectedSlot && !isPending ? handleSave : undefined}
      />
      <View className='flex-1 px-5'>
        <ScrollView
          className='flex-1'
          contentContainerStyle={{ paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps='handled'
        >
          <Text className='text-2xl font-semibold text-gray-900 mb-6'>Edit booking</Text>

          <FormField label='Service'>
            <LockedField value={order.service?.name ?? order.combination?.name ?? '—'} disabled />
          </FormField>

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

        {isPending && (
          <View className='pb-6 items-center'>
            <ActivityIndicator color={colors.primary[700]} />
          </View>
        )}
      </View>
    </>
  );
};
