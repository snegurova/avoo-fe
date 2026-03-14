import { Pressable, Text, View } from 'react-native';

import { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';

import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';

type Props = {
  visible: boolean;
  onClose: () => void;
  masters: MasterWithRelationsEntityResponse[];
  selectedMasterIds: number[];
  onSelect: (ids: number[]) => void;
};

export const MastersSheet = ({ visible, onClose, masters, selectedMasterIds, onSelect }: Props) => (
  <CustomBottomSheet visible={visible} onClose={onClose} snapToContent>
    <View className='px-4 pb-4'>
      <Pressable
        className='flex-row items-center justify-between mb-2 rounded-lg border border-gray-200 px-4 py-3'
        onPress={() => {
          onSelect([]);
          onClose();
        }}
      >
        <Text className='text-sm text-gray-900'>All masters</Text>
        <View
          className={`w-5 h-5 rounded-full border items-center justify-center ${selectedMasterIds.length === 0 ? 'bg-primary-700 border-primary-700' : 'border-gray-400'}`}
        >
          {selectedMasterIds.length === 0 && <Text className='text-[10px] text-white'>✓</Text>}
        </View>
      </Pressable>
      {masters.map((master) => {
        const isSelected = selectedMasterIds.includes(master.id as number);
        return (
          <Pressable
            key={master.id}
            className='flex-row items-center justify-between rounded-lg border border-gray-200 px-4 py-3 mb-2'
            onPress={() => {
              let nextIds = [...selectedMasterIds];
              nextIds = isSelected
                ? nextIds.filter((id) => id !== master.id)
                : [...nextIds, master.id as number];
              onSelect(nextIds);
              onClose();
            }}
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
    </View>
  </CustomBottomSheet>
);
