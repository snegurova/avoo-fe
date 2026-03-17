import { Pressable, Text, View } from 'react-native';

import { scheduleUtils } from '@/utils/scheduleUtils';

type Props = {
  value: number;
  onDecrement: () => void;
  onIncrement: () => void;
  onPress: () => void;
};

export const TimeStepper = ({ value, onDecrement, onIncrement, onPress }: Props) => (
  <View className='flex-1 flex-row items-center justify-between rounded-xl border border-gray-200 bg-white px-2 py-3'>
    <Pressable hitSlop={8} className='w-7 h-7 items-center justify-center' onPress={onDecrement}>
      <Text className='text-base font-medium text-gray-500'>−</Text>
    </Pressable>
    <Pressable hitSlop={4} onPress={onPress}>
      <Text className='text-sm font-semibold text-gray-900'>{scheduleUtils.formatTime(value)}</Text>
    </Pressable>
    <Pressable hitSlop={8} className='w-7 h-7 items-center justify-center' onPress={onIncrement}>
      <Text className='text-base font-medium text-gray-500'>+</Text>
    </Pressable>
  </View>
);
