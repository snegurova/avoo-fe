import { Pressable, Text, View } from 'react-native';

import { timeUtils } from '@avoo/shared';

type Props = {
  value: number;
  onChange: (v: number) => void;
};

export const DurationStepper = ({ value, onChange }: Props) => (
  <View className='flex-row items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3'>
    <Pressable
      hitSlop={8}
      className='w-8 h-8 items-center justify-center'
      onPress={() => onChange(Math.max(5, value - 5))}
    >
      <Text className='text-xl text-gray-500'>−</Text>
    </Pressable>
    <Text className='text-sm font-medium text-gray-900'>{timeUtils.convertDuration(value)}</Text>
    <Pressable
      hitSlop={8}
      className='w-8 h-8 items-center justify-center'
      onPress={() => onChange(value + 5)}
    >
      <Text className='text-xl text-gray-500'>+</Text>
    </Pressable>
  </View>
);
