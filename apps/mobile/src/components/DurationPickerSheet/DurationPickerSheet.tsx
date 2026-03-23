import { Pressable, ScrollView, Text, View } from 'react-native';

import { timeUtils } from '@avoo/shared';

import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';

const DURATION_OPTIONS = timeUtils.getDurationOptionsRange(15, 285, 15);

type Props = {
  visible: boolean;
  onClose: () => void;
  selectedMinutes: number;
  onSelect: (minutes: number) => void;
};

export const DurationPickerSheet = (props: Props) => {
  const { visible, onClose, selectedMinutes, onSelect } = props;

  return (
    <CustomBottomSheet visible={visible} onClose={onClose} snapToContent>
      <ScrollView style={{ maxHeight: 360 }} showsVerticalScrollIndicator={false}>
        <View className='px-4 pb-4'>
          {DURATION_OPTIONS.map(({ value, label }) => {
            const isSelected = value === selectedMinutes;
            return (
              <Pressable
                key={value}
                className='flex-row items-center justify-between rounded-lg border border-gray-200 px-4 py-3 mb-2'
                onPress={() => {
                  onSelect(value);
                  onClose();
                }}
              >
                <Text className='text-sm text-gray-900'>{label}</Text>
                <View
                  className={`w-5 h-5 rounded-full border items-center justify-center ${isSelected ? 'bg-primary-700 border-primary-700' : 'border-gray-400'}`}
                >
                  {isSelected && <Text className='text-[10px] text-white'>✓</Text>}
                </View>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>
    </CustomBottomSheet>
  );
};
