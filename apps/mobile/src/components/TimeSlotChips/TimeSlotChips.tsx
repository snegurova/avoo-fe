import { ActivityIndicator, Pressable, Text, View } from 'react-native';

import { colors } from '@avoo/design-tokens';
import { timeUtils } from '@avoo/shared';

type Props = {
  slots: string[];
  selected: string | null;
  onSelect: (slot: string) => void;
  isLoading: boolean;
  enabled: boolean;
};

export const TimeSlotChips = (props: Props) => {
  const { slots, selected, onSelect, isLoading, enabled } = props;

  if (!enabled) {
    return (
      <View className='py-4'>
        <Text className='text-sm text-gray-400 text-center'>
          Select service and master to see available times
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View className='py-6 items-center'>
        <ActivityIndicator color={colors.primary[700]} />
      </View>
    );
  }

  if (slots.length === 0) {
    return (
      <View className='py-4'>
        <Text className='text-sm text-gray-400 text-center'>No available time on this day</Text>
      </View>
    );
  }

  return (
    <View className='flex-row flex-wrap' style={{ gap: 8 }}>
      {slots.map((slot) => {
        const isSelected = slot === selected;
        return (
          <Pressable
            key={slot}
            onPress={() => onSelect(slot)}
            className='rounded-full py-2 border items-center justify-center'
            style={{
              flexBasis: '22%',
              flexGrow: 1,
              backgroundColor: isSelected ? colors.primary[700] : colors.white,
              borderColor: isSelected ? colors.primary[700] : colors.gray[200],
            }}
          >
            <Text
              className='text-sm font-medium'
              style={{ color: isSelected ? colors.white : colors.gray[700] }}
            >
              {timeUtils.getTime(slot)}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};
