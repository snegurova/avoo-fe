import { Text, View } from 'react-native';

import { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';

import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';
import { RadioListItem } from '@/shared/RadioListItem/RadioListItem';

type Props = {
  visible: boolean;
  onClose: () => void;
  masters: MasterWithRelationsEntityResponse[];
  selectedMasterIds: number[];
  onSelect: (ids: number[]) => void;
  hideAllMasters?: boolean;
};

export const MastersSheet = ({
  visible,
  onClose,
  masters,
  selectedMasterIds,
  onSelect,
  hideAllMasters,
}: Props) => (
  <CustomBottomSheet visible={visible} onClose={onClose} snapToContent>
    <View className='px-4 pb-4'>
      {!hideAllMasters && (
        <RadioListItem
          label='All masters'
          isSelected={selectedMasterIds.length === 0}
          onPress={() => {
            onSelect([]);
            onClose();
          }}
        />
      )}
      {masters.map((master) => {
        const isSelected = selectedMasterIds.includes(master.id);
        return (
          <RadioListItem
            key={master.id}
            label={master.name}
            isSelected={isSelected}
            onPress={() => {
              const nextIds = isSelected
                ? selectedMasterIds.filter((id) => id !== master.id)
                : [...selectedMasterIds, master.id];
              onSelect(nextIds);
              onClose();
            }}
          />
        );
      })}
      {masters.length === 0 && (
        <Text className='text-sm text-gray-400 text-center py-6'>No masters yet</Text>
      )}
    </View>
  </CustomBottomSheet>
);
