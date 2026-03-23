import { Pressable, Text, View } from 'react-native';

import { Category } from '@avoo/axios/types/apiTypes';

import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';

type Props = {
  visible: boolean;
  onClose: () => void;
  categories: Category[];
  selectedId: number | null;
  onSelect: (id: number, name: string) => void;
};

export const CategoryPickerSheet = (props: Props) => {
  const { visible, onClose, categories, selectedId, onSelect } = props;

  return (
    <CustomBottomSheet visible={visible} onClose={onClose} snapToContent>
      <View className='px-4 pb-4'>
        {categories.map((cat) => {
          const isSelected = cat.id === selectedId;
          return (
            <Pressable
              key={cat.id}
              className='flex-row items-center justify-between rounded-lg border border-gray-200 px-4 py-3 mb-2'
              onPress={() => {
                onSelect(cat.id, cat.name);
                onClose();
              }}
            >
              <Text className='text-sm text-gray-900'>{cat.name}</Text>
              <View
                className={`w-5 h-5 rounded-full border items-center justify-center ${isSelected ? 'bg-primary-700 border-primary-700' : 'border-gray-400'}`}
              >
                {isSelected && <Text className='text-[10px] text-white'>✓</Text>}
              </View>
            </Pressable>
          );
        })}
        {categories.length === 0 && (
          <Text className='text-sm text-gray-400 text-center py-6'>No categories yet</Text>
        )}
      </View>
    </CustomBottomSheet>
  );
};
