import { Pressable, Text, View } from 'react-native';

import { MaterialCommunityIcons } from '@/shared/icons';
import { scheduleUtils } from '@/utils/scheduleUtils';

type Props = {
  endAt?: string | null;
  onPress: () => void;
};

export const EndDateField = (props: Props) => {
  const { endAt, onPress } = props;
  return (
    <Pressable onPress={onPress}>
      <View className='rounded-lg border border-gray-200 bg-white px-4 py-4 flex-row items-center justify-between'>
        <Text className={`text-base ${endAt ? 'text-gray-900' : 'text-gray-400'}`}>
          {scheduleUtils.formatDate(endAt)}
        </Text>
        <MaterialCommunityIcons name='calendar-outline' size={16} color='#9ca3af' />
      </View>
    </Pressable>
  );
};
