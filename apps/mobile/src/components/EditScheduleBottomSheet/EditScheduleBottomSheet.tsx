import React, { useState } from 'react';
import { useFieldArray, useFormState } from 'react-hook-form';
import { Alert, Platform, Pressable, ScrollView, Text, View } from 'react-native';

import {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import { ScheduleEntity } from '@avoo/axios/types/apiTypes';
import { scheduleHooks } from '@avoo/hooks';

import { DatePickerSheet } from '@/components/DatePickerSheet/DatePickerSheet';
import { EndDateField } from '@/components/EndDateField/EndDateField';
import { LockedField } from '@/components/LockedField/LockedField';
import { TimePickerSheet } from '@/components/TimePickerSheet/TimePickerSheet';
import { WorkingDayCard } from '@/components/WorkingDayCard/WorkingDayCard';
import { useWorkingHoursEditor } from '@/hooks/useWorkingHoursEditor';
import { BottomSheetHeader } from '@/shared/BottomSheetHeader/BottomSheetHeader';
import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';
import FormTextInput from '@/shared/FormTextInput';
import { scheduleUtils } from '@/utils/scheduleUtils';

type Props = {
  schedule: ScheduleEntity | null;
  visible: boolean;
  onClose: () => void;
};

export const EditScheduleBottomSheet = ({ schedule, visible, onClose }: Props) => {
  if (!schedule) return null;
  return (
    <CustomBottomSheet
      visible={visible}
      onClose={onClose}
      snapToContent={false}
      disableSwipeToClose
    >
      <EditScheduleForm schedule={schedule} onClose={onClose} />
    </CustomBottomSheet>
  );
};

type FormProps = { schedule: ScheduleEntity; onClose: () => void };

const EditScheduleForm = ({ schedule, onClose }: FormProps) => {
  const { control, errors, handleSubmit, watch, setValue } = scheduleHooks.useUpdateScheduleForm({
    defaultValues: schedule,
    startAt: schedule.startAt,
    onSuccess: onClose,
  });
  const { deleteScheduleMutationAsync } = scheduleHooks.useDeleteSchedule();
  const { fields, update } = useFieldArray({ control, name: 'workingHours' });
  const { isDirty } = useFormState({ control });
  const workingHours = watch('workingHours');
  const endAt = watch('endAt');

  const {
    activeTimeField,
    pendingTime,
    setPendingTime,
    setActiveTimeField,
    handleToggleDay,
    shiftTime,
    addBreak,
    removeBreak,
    shiftBreakTime,
    openTimePicker,
    confirmTime,
  } = useWorkingHoursEditor(workingHours, update);

  const handleClose = () => {
    if (isDirty) {
      Alert.alert('Unsaved changes', 'You have unsaved changes. Are you sure you want to leave?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Discard changes', style: 'destructive', onPress: onClose },
      ]);
    } else {
      onClose();
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Delete schedule',
      'This will permanently delete the schedule and remove it from all assigned masters. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteScheduleMutationAsync(schedule.id);
              onClose();
            } catch {
              Alert.alert('Error', 'Failed to delete schedule. Please try again.');
            }
          },
        },
      ],
    );
  };

  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [pendingDate, setPendingDate] = useState<Date | null>(null);

  const handleEndDateChange = (_: DateTimePickerEvent, date?: Date) => {
    if (!date) return;
    if (Platform.OS === 'ios') {
      setPendingDate(date);
    } else {
      setValue('endAt', date.toISOString().slice(0, 10), { shouldValidate: true });
    }
  };

  const openEndDatePicker = () => {
    const initial = endAt ? new Date(endAt) : new Date();
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({ value: initial, mode: 'date', onChange: handleEndDateChange });
    } else {
      setPendingDate(initial);
      setIsDatePickerOpen(true);
    }
  };

  return (
    <>
      <BottomSheetHeader handleClose={handleClose} handleConfirm={handleSubmit} />
      <ScrollView
        className='px-4'
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <View className='mb-3'>
          <Text className='mb-2 text-sm font-medium text-black'>Schedule name *</Text>
          <FormTextInput
            name='name'
            control={control}
            placeholder='Type schedule name'
            error={errors.name?.message}
          />
        </View>
        <View className='mb-3'>
          <Text className='mb-2 text-sm font-medium text-black'>Type of schedule *</Text>
          <LockedField value={scheduleUtils.getPatternLabel(schedule.pattern)} />
        </View>
        <View className='mb-3'>
          <Text className='mb-2 text-sm font-medium text-black'>Apply schedule to *</Text>
          <LockedField value={schedule.master?.name ?? 'All masters'} />
        </View>
        <View className='mb-3'>
          <Text className='mb-2 text-sm font-medium text-black'>Start date *</Text>
          <LockedField value={scheduleUtils.formatDate(schedule.startAt)} />
        </View>
        <View className='mb-5'>
          <Text className='mb-2 text-sm font-medium text-black'>End date</Text>
          <EndDateField endAt={endAt} onPress={openEndDatePicker} />
        </View>
        <Text className='mb-3 text-sm font-medium text-black'>Weekly breakdown</Text>
        {fields.map((field, index) => (
          <WorkingDayCard
            key={field.id}
            field={field}
            index={index}
            value={workingHours?.[index]}
            onToggle={handleToggleDay}
            onShift={shiftTime}
            onOpen={openTimePicker}
            onAddBreak={addBreak}
            onRemoveBreak={removeBreak}
            onShiftBreak={shiftBreakTime}
          />
        ))}
        <Pressable
          className='mt-3 mb-1 rounded-xl border border-red-400 py-4 items-center'
          onPress={handleDelete}
        >
          <Text className='text-base font-bold text-red-500'>Delete schedule</Text>
        </Pressable>
      </ScrollView>
      {Platform.OS === 'ios' && isDatePickerOpen && pendingDate && (
        <DatePickerSheet
          value={pendingDate}
          onClose={() => {
            setIsDatePickerOpen(false);
            setPendingDate(null);
          }}
          onConfirm={() => {
            setValue('endAt', pendingDate.toISOString().slice(0, 10), { shouldValidate: true });
            setIsDatePickerOpen(false);
            setPendingDate(null);
          }}
          onChange={handleEndDateChange}
        />
      )}
      {Platform.OS === 'ios' && activeTimeField && pendingTime && (
        <TimePickerSheet
          value={pendingTime}
          onClose={() => {
            setActiveTimeField(null);
            setPendingTime(null);
          }}
          onConfirm={confirmTime}
          onChange={(_, picked) => picked && setPendingTime(picked)}
        />
      )}
    </>
  );
};
