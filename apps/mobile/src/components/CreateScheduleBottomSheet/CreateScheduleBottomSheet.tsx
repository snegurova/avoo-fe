import { useEffect, useMemo, useState } from 'react';
import { useFieldArray } from 'react-hook-form';
import { Platform, Pressable, ScrollView, Switch, Text, View } from 'react-native';

import {
  DateTimePickerAndroid,
  type DateTimePickerEvent,
} from '@react-native-community/datetimepicker';

import { DAYS_NAME, END_MINUTE, SCHEDULE_OPTIONS, START_MINUTE } from '@avoo/constants';
import { colors } from '@avoo/design-tokens';
import { masterHooks, scheduleHooks, utils } from '@avoo/hooks';

import { DatePickerSheet } from '@/components/DatePickerSheet/DatePickerSheet';
import { MastersSheet } from '@/components/MastersSheet/MastersSheet';
import { ScheduleTypeSheet } from '@/components/ScheduleTypeSheet/ScheduleTypeSheet';
import { SelectableField } from '@/components/SelectableField/SelectableField';
import { TimePickerSheet } from '@/components/TimePickerSheet/TimePickerSheet';
import { TimeField, useWorkingHoursEditor } from '@/hooks/useWorkingHoursEditor';
import { BottomSheetHeader } from '@/shared/BottomSheetHeader/BottomSheetHeader';
import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';
import FormTextInput from '@/shared/FormTextInput';
import { TimeStepper } from '@/shared/TimeStepper/TimeStepper';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const CreateScheduleBottomSheet = (props: Props) => {
  const { visible, onClose } = props;
  const { control, errors, handleSubmit, watch, setValue } = scheduleHooks.useCreateScheduleForm({
    onSuccess: onClose,
  });

  const { fields, replace, append, remove, update } = useFieldArray({
    control,
    name: 'workingHours',
  });

  const masters = masterHooks.useGetMastersProfileInfo()?.items ?? [];
  const selectedMasterIds = watch('masterIds') ?? [];
  const scheduleType = watch('patternType');
  const workingHours = watch('workingHours');
  const startAt = watch('startAt');
  const endAt = watch('endAt');

  const {
    value: isMastersSheetOpen,
    enable: openMastersSheet,
    disable: closeMastersSheet,
  } = utils.useBooleanState(false);
  const {
    value: isTypeSheetOpen,
    enable: openTypeSheet,
    disable: closeTypeSheet,
  } = utils.useBooleanState(false);

  const [activeDateField, setActiveDateField] = useState<'startAt' | 'endAt' | null>(null);
  const [pendingDate, setPendingDate] = useState<Date | null>(null);

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

  useEffect(() => {
    if (!scheduleType) return;
    const selectedOption = SCHEDULE_OPTIONS.find((o) => o.value === scheduleType);
    if (!selectedOption) return;
    setValue('pattern', selectedOption.pattern);
    replace(
      Array.from({ length: selectedOption.pattern }).map((_, i) => ({
        day: i + 1,
        enabled: selectedOption.daysOn.includes(i + 1),
        startTimeMinutes: selectedOption.daysOn.includes(i + 1) ? START_MINUTE : 0,
        endTimeMinutes: selectedOption.daysOn.includes(i + 1) ? END_MINUTE : 0,
        breaks: [],
      })),
    );
  }, [scheduleType, replace, setValue]);

  const appendDay = () => {
    append({
      day: fields.length + 1,
      enabled: true,
      startTimeMinutes: START_MINUTE,
      endTimeMinutes: END_MINUTE,
      breaks: [],
    });
    setValue('pattern', fields.length + 1);
  };

  const handleChangeDateFor =
    (field: 'startAt' | 'endAt') => (_: DateTimePickerEvent, date?: Date) => {
      if (!date) return;
      if (Platform.OS === 'ios') {
        setPendingDate(date);
      } else {
        setValue(field, date.toISOString().slice(0, 10), { shouldValidate: true });
      }
    };

  const openDatePicker = (field: 'startAt' | 'endAt') => {
    const current = field === 'startAt' ? startAt : endAt;
    const initial = current ? new Date(current) : new Date();
    if (Platform.OS === 'android') {
      DateTimePickerAndroid.open({
        value: initial,
        mode: 'date',
        onChange: handleChangeDateFor(field),
      });
    } else {
      setPendingDate(initial);
      setActiveDateField(field);
    }
  };

  const mastersLabel = useMemo(() => {
    if (!selectedMasterIds || selectedMasterIds.length === 0) return 'All masters';
    if (selectedMasterIds.length === masters.length) return 'All masters';
    if (selectedMasterIds.length === 1) {
      const master = masters.find((m) => m.id === selectedMasterIds[0]);
      return master?.name ?? '1 master';
    }
    return `${selectedMasterIds.length} masters`;
  }, [selectedMasterIds, masters]);

  return (
    <CustomBottomSheet
      visible={visible}
      onClose={onClose}
      snapToContent={false}
      disableSwipeToClose
    >
      <BottomSheetHeader handleClose={onClose} handleConfirm={handleSubmit} />

      <ScrollView
        className='px-4'
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        <Text className='text-lg font-bold text-black mb-4'>New schedule</Text>

        <View className='mb-4'>
          <Text className='mb-2 text-sm font-medium text-black'>Schedule name *</Text>
          <FormTextInput
            name='name'
            control={control}
            placeholder='Type schedule name'
            error={errors.name?.message}
          />
        </View>

        <View className='mb-4'>
          <Text className='mb-2 text-sm font-medium text-black'>Type of schedule *</Text>
          <SelectableField
            value={SCHEDULE_OPTIONS.find((o) => o.value === scheduleType)?.label ?? 'Select type'}
            onPress={openTypeSheet}
          />
        </View>

        <View className='mb-4'>
          <Text className='mb-2 text-sm font-medium text-black'>Apply schedule to *</Text>
          <SelectableField value={mastersLabel} onPress={openMastersSheet} />
        </View>

        <View className='mb-4'>
          <Text className='mb-2 text-sm font-medium text-black'>Start date *</Text>
          <Pressable onPress={() => openDatePicker('startAt')}>
            <FormTextInput
              name='startAt'
              control={control}
              pointerEvents='none'
              editable={false}
              placeholder='YYYY-MM-DD'
              keyboardType='numbers-and-punctuation'
              error={errors.startAt?.message}
            />
          </Pressable>
        </View>

        <View className='mb-5'>
          <Text className='mb-2 text-sm font-medium text-black'>End date</Text>
          <Pressable onPress={() => openDatePicker('endAt')}>
            <FormTextInput
              name='endAt'
              control={control}
              pointerEvents='none'
              editable={false}
              placeholder='Ongoing'
              keyboardType='numbers-and-punctuation'
              error={errors.endAt?.message}
            />
          </Pressable>
        </View>

        <Text className='mb-3 text-sm font-medium text-black'>Weekly breakdown</Text>

        {fields.map((field, index) => {
          const value = workingHours?.[index];
          const isEnabled = value?.enabled ?? false;
          const breaks = value?.breaks ?? [];
          return (
            <View
              key={field.id}
              className='mb-3'
              style={{ marginTop: scheduleType === 'custom' && fields.length > 1 ? 10 : 0 }}
            >
              {scheduleType === 'custom' && fields.length > 1 && (
                <Pressable
                  hitSlop={6}
                  onPress={() => remove(index)}
                  style={{
                    position: 'absolute',
                    top: -10,
                    right: -10,
                    zIndex: 10,
                    width: 22,
                    height: 22,
                    borderRadius: 11,
                    backgroundColor: '#ef4444',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.15,
                    shadowRadius: 2,
                    elevation: 3,
                  }}
                >
                  <Text style={{ color: '#fff', fontSize: 14, lineHeight: 16, fontWeight: '600' }}>
                    ×
                  </Text>
                </Pressable>
              )}
              <View className='rounded-2xl bg-white border border-gray-200 px-4 pt-4 pb-3'>
                <View className='flex-row items-center justify-between mb-4'>
                  <Text className='text-base font-semibold text-gray-900'>
                    {scheduleType === 'weekly'
                      ? (DAYS_NAME[field.day - 1] ?? `Day ${field.day}`)
                      : `Day ${index + 1}`}
                  </Text>
                  <View className='flex-row items-center gap-3'>
                    <Text className='text-xs text-gray-400'>Working day</Text>
                    <Switch
                      value={isEnabled}
                      onValueChange={(v) => handleToggleDay(index, v)}
                      trackColor={{ false: colors.gray[300], true: colors.primary[700] }}
                      thumbColor={colors.white}
                      ios_backgroundColor={colors.gray[300]}
                    />
                  </View>
                </View>
                {isEnabled && (
                  <>
                    <View className='flex-row items-center gap-3 mb-3'>
                      <TimeStepper
                        value={value?.startTimeMinutes ?? 0}
                        onDecrement={() => shiftTime(index, TimeField.StartTime, -1)}
                        onIncrement={() => shiftTime(index, TimeField.StartTime, 1)}
                        onPress={() => openTimePicker(index, TimeField.StartTime)}
                      />
                      <Text className='text-xs text-gray-400'>to</Text>
                      <TimeStepper
                        value={value?.endTimeMinutes ?? 0}
                        onDecrement={() => shiftTime(index, TimeField.EndTime, -1)}
                        onIncrement={() => shiftTime(index, TimeField.EndTime, 1)}
                        onPress={() => openTimePicker(index, TimeField.EndTime)}
                      />
                    </View>
                    {breaks.map((brk, breakIndex) => (
                      <View
                        key={breakIndex}
                        className='mb-2 rounded-xl border border-gray-200 bg-gray-50 px-3 pt-2 pb-3'
                      >
                        <View className='flex-row items-center justify-between mb-2'>
                          <Text className='text-xs font-medium text-gray-400'>Break</Text>
                          <Pressable hitSlop={10} onPress={() => removeBreak(index, breakIndex)}>
                            <Text className='text-base text-gray-400'>×</Text>
                          </Pressable>
                        </View>
                        <View className='flex-row items-center gap-3'>
                          <TimeStepper
                            value={brk.breakStartTimeMinutes}
                            onDecrement={() =>
                              shiftBreakTime(index, breakIndex, TimeField.BreakStart, -1)
                            }
                            onIncrement={() =>
                              shiftBreakTime(index, breakIndex, TimeField.BreakStart, 1)
                            }
                            onPress={() => openTimePicker(index, TimeField.BreakStart, breakIndex)}
                          />
                          <Text className='text-xs text-gray-400'>to</Text>
                          <TimeStepper
                            value={brk.breakEndTimeMinutes}
                            onDecrement={() =>
                              shiftBreakTime(index, breakIndex, TimeField.BreakEnd, -1)
                            }
                            onIncrement={() =>
                              shiftBreakTime(index, breakIndex, TimeField.BreakEnd, 1)
                            }
                            onPress={() => openTimePicker(index, TimeField.BreakEnd, breakIndex)}
                          />
                        </View>
                      </View>
                    ))}
                    <Pressable
                      className='flex-row items-center gap-1 mt-1'
                      onPress={() => addBreak(index)}
                    >
                      <Text className='text-lg text-primary-700 leading-none'>⊕</Text>
                      <Text className='text-sm text-primary-700'>Add break</Text>
                    </Pressable>
                  </>
                )}
              </View>
            </View>
          );
        })}

        {scheduleType === 'custom' && (
          <Pressable
            className='mb-4 rounded-xl border border-primary-700 py-3 items-center'
            onPress={appendDay}
          >
            <Text className='text-sm font-medium text-primary-700'>+ Add day</Text>
          </Pressable>
        )}
      </ScrollView>

      <MastersSheet
        visible={isMastersSheetOpen}
        onClose={closeMastersSheet}
        masters={masters}
        selectedMasterIds={selectedMasterIds.filter((id): id is number => id !== undefined)}
        onSelect={(ids) => setValue('masterIds', ids)}
      />

      <ScheduleTypeSheet
        visible={isTypeSheetOpen}
        onClose={closeTypeSheet}
        selectedType={scheduleType}
        onSelect={(value) => setValue('patternType', value)}
      />

      {Platform.OS === 'ios' && activeDateField && pendingDate && (
        <DatePickerSheet
          value={pendingDate}
          onClose={() => {
            setActiveDateField(null);
            setPendingDate(null);
          }}
          onConfirm={() => {
            setValue(activeDateField, pendingDate.toISOString().slice(0, 10), {
              shouldValidate: true,
            });
            setActiveDateField(null);
            setPendingDate(null);
          }}
          onChange={handleChangeDateFor(activeDateField)}
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
    </CustomBottomSheet>
  );
};
