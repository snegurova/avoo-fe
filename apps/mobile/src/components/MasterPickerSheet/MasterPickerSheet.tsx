import { Pressable, Text, View } from 'react-native';

import { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';

import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';

type Props = {
  visible: boolean;
  onClose: () => void;
  masters: MasterWithRelationsEntityResponse[];
  selectedIds: number[];
  onConfirm: (ids: number[]) => void;
};

export const MasterPickerSheet = (props: Props) => {
  const { visible, onClose, masters, selectedIds, onConfirm } = props;

  const toggleMaster = (id: number) => {
    const next = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id];
    onConfirm(next);
  };

  return (
    <CustomBottomSheet visible={visible} onClose={onClose} snapToContent>
      <View className='px-4 pb-4'>
        {masters.map((master) => {
          const isSelected = selectedIds.includes(master.id);
          return (
            <Pressable
              key={master.id}
              className='flex-row items-center justify-between rounded-lg border border-gray-200 px-4 py-3 mb-2'
              onPress={() => toggleMaster(master.id)}
            >
              <Text className='text-sm text-gray-900'>{master.name}</Text>
              <View
                className={`w-5 h-5 rounded-full border items-center justify-center ${isSelected ? 'bg-primary-700 border-primary-700' : 'border-gray-400'}`}
              >
                {isSelected && <Text className='text-[10px] text-white'>✓</Text>}
              </View>
            </Pressable>
          );
        })}
        {masters.length === 0 && (
          <Text className='text-sm text-gray-400 text-center py-6'>No masters yet</Text>
        )}
      </View>
    </CustomBottomSheet>
  );
};
