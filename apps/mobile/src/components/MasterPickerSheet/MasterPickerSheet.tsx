import { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { MasterWithRelationsEntityResponse } from '@avoo/axios/types/apiTypes';

import { BottomSheetHeader } from '@/shared/BottomSheetHeader/BottomSheetHeader';
import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';
import { RadioListItem } from '@/shared/RadioListItem/RadioListItem';

type Props = {
  visible: boolean;
  onClose: () => void;
  masters: MasterWithRelationsEntityResponse[];
  selectedIds: number[];
  onConfirm: (ids: number[]) => void;
};

export const MasterPickerSheet = (props: Props) => {
  const { visible, onClose, masters, selectedIds, onConfirm } = props;

  const [draftIds, setDraftIds] = useState<number[]>(selectedIds);

  useEffect(() => {
    if (visible) setDraftIds(selectedIds);
  }, [visible]);

  const toggle = (id: number) => {
    setDraftIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleConfirm = () => {
    onConfirm(draftIds);
    onClose();
  };

  return (
    <CustomBottomSheet visible={visible} onClose={onClose} snapToContent>
      <BottomSheetHeader handleClose={onClose} handleConfirm={handleConfirm} />
      <View className='px-4 pb-4'>
        {masters.map((master) => (
          <RadioListItem
            key={master.id}
            label={master.name}
            isSelected={draftIds.includes(master.id)}
            onPress={() => toggle(master.id)}
          />
        ))}
        {masters.length === 0 && (
          <Text className='text-sm text-gray-400 text-center py-6'>No masters yet</Text>
        )}
      </View>
    </CustomBottomSheet>
  );
};
