import { Pressable, Switch, Text, View } from 'react-native';

import { DAYS_NAME } from '@avoo/constants';
import { colors } from '@avoo/design-tokens';

import { BreakItem } from '@/components/BreakItem/BreakItem';
import { TimeField } from '@/hooks/useWorkingHoursEditor';
import { TimeStepper } from '@/shared/TimeStepper/TimeStepper';

type ValueProps = {
  enabled?: boolean;
  startTimeMinutes?: number;
  endTimeMinutes?: number;
  breaks?: { breakStartTimeMinutes: number; breakEndTimeMinutes: number }[];
};

type Props = {
  field: { id: string; day: number };
  index: number;
  value?: ValueProps;
  onToggle: (index: number, value: boolean) => void;
  onShift: (
    index: number,
    field: TimeField.StartTime | TimeField.EndTime,
    direction: -1 | 1,
  ) => void;
  onOpen: (index: number, field: TimeField, breakIndex?: number | null) => void;
  onAddBreak: (index: number) => void;
  onRemoveBreak: (index: number, breakIndex: number) => void;
  onShiftBreak: (
    index: number,
    breakIndex: number,
    field: TimeField.BreakStart | TimeField.BreakEnd,
    direction: -1 | 1,
  ) => void;
};

export const WorkingDayCard = (props: Props) => {
  const {
    field,
    index,
    value,
    onToggle,
    onShift,
    onOpen,
    onAddBreak,
    onRemoveBreak,
    onShiftBreak,
  } = props;
  const isEnabled = value?.enabled ?? false;
  const breaks = value?.breaks ?? [];

  return (
    <View className='mb-3 rounded-2xl bg-white border border-gray-200 px-4 pt-4 pb-3'>
      <View className='flex-row items-center justify-between mb-4'>
        <Text className='text-base font-semibold text-gray-900'>
          {DAYS_NAME[field.day - 1] ?? `Day ${field.day}`}
        </Text>
        <View className='flex-row items-center gap-3'>
          <Text className='text-xs text-gray-400'>Working day</Text>
          <Switch
            value={isEnabled}
            onValueChange={(v) => onToggle(index, v)}
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
              onDecrement={() => onShift(index, TimeField.StartTime, -1)}
              onIncrement={() => onShift(index, TimeField.StartTime, 1)}
              onPress={() => onOpen(index, TimeField.StartTime)}
            />
            <Text className='text-xs text-gray-400'>to</Text>
            <TimeStepper
              value={value?.endTimeMinutes ?? 0}
              onDecrement={() => onShift(index, TimeField.EndTime, -1)}
              onIncrement={() => onShift(index, TimeField.EndTime, 1)}
              onPress={() => onOpen(index, TimeField.EndTime)}
            />
          </View>
          {breaks.map((brk, breakIndex) => (
            <BreakItem
              key={breakIndex}
              brk={brk}
              breakIndex={breakIndex}
              dayIndex={index}
              onRemove={onRemoveBreak}
              onShift={onShiftBreak}
              onOpen={(dayIdx, field, brkIdx) => onOpen(dayIdx, field, brkIdx)}
            />
          ))}
          <Pressable className='flex-row items-center gap-1 mt-1' onPress={() => onAddBreak(index)}>
            <Text className='text-lg text-primary-700 leading-none'>⊕</Text>
            <Text className='text-sm text-primary-700'>Add break</Text>
          </Pressable>
        </>
      )}
    </View>
  );
};
