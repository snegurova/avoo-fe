import { Pressable, Text, View } from 'react-native';

import { TimeField } from '@/hooks/useWorkingHoursEditor';
import { TimeStepper } from '@/shared/TimeStepper/TimeStepper';

type Props = {
  brk: { breakStartTimeMinutes: number; breakEndTimeMinutes: number };
  breakIndex: number;
  dayIndex: number;
  onRemove: (dayIndex: number, breakIndex: number) => void;
  onShift: (
    dayIndex: number,
    breakIndex: number,
    field: TimeField.BreakStart | TimeField.BreakEnd,
    direction: -1 | 1,
  ) => void;
  onOpen: (
    dayIndex: number,
    field: TimeField.BreakStart | TimeField.BreakEnd,
    breakIndex: number,
  ) => void;
};

export const BreakItem = ({ brk, breakIndex, dayIndex, onRemove, onShift, onOpen }: Props) => (
  <View className='mb-2 rounded-xl border border-gray-200 bg-gray-50 px-3 pt-2 pb-3'>
    <View className='flex-row items-center justify-between mb-2'>
      <Text className='text-xs font-medium text-gray-400'>Break</Text>
      <Pressable hitSlop={10} onPress={() => onRemove(dayIndex, breakIndex)}>
        <Text className='text-base text-gray-400'>×</Text>
      </Pressable>
    </View>
    <View className='flex-row items-center gap-3'>
      <TimeStepper
        value={brk.breakStartTimeMinutes}
        onDecrement={() => onShift(dayIndex, breakIndex, TimeField.BreakStart, -1)}
        onIncrement={() => onShift(dayIndex, breakIndex, TimeField.BreakStart, 1)}
        onPress={() => onOpen(dayIndex, TimeField.BreakStart, breakIndex)}
      />
      <Text className='text-xs text-gray-400'>to</Text>
      <TimeStepper
        value={brk.breakEndTimeMinutes}
        onDecrement={() => onShift(dayIndex, breakIndex, TimeField.BreakEnd, -1)}
        onIncrement={() => onShift(dayIndex, breakIndex, TimeField.BreakEnd, 1)}
        onPress={() => onOpen(dayIndex, TimeField.BreakEnd, breakIndex)}
      />
    </View>
  </View>
);
