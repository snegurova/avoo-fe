import { Pressable, Text, View } from 'react-native';

import { SCHEDULE_OPTIONS } from '@avoo/constants';

import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';

type Props = {
  visible: boolean;
  onClose: () => void;
  selectedType: string | undefined;
  onSelect: (value: string) => void;
};

export const ScheduleTypeSheet = (props: Props) => {
  const { visible, onClose, selectedType, onSelect } = props;
  return (
    <CustomBottomSheet visible={visible} onClose={onClose} snapToContent>
      <View className='px-4 pb-6'>
        {SCHEDULE_OPTIONS.map((option) => {
          const isSelected = option.value === selectedType;
          return (
            <Pressable
              key={option.value}
              className='flex-row items-center justify-between rounded-lg border border-gray-200 px-4 py-3 mb-2'
              onPress={() => {
                onSelect(option.value);
                onClose();
              }}
            >
              <Text className='text-sm text-gray-900'>{option.label}</Text>
              <View
                className={`w-5 h-5 rounded-full border items-center justify-center ${isSelected ? 'bg-primary-700 border-primary-700' : 'border-gray-400'}`}
              >
                {isSelected && <Text className='text-[10px] text-white'>✓</Text>}
              </View>
            </Pressable>
          );
        })}
      </View>
    </CustomBottomSheet>
  );
};
