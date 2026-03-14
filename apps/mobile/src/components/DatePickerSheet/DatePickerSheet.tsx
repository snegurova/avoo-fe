import { View } from 'react-native';

import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { colors } from '@avoo/design-tokens';

import { BottomSheetHeader } from '@/shared/BottomSheetHeader/BottomSheetHeader';
import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';

type Props = {
  value: Date;
  onClose: () => void;
  onConfirm: () => void;
  onChange: (event: DateTimePickerEvent, date?: Date) => void;
};

export const DatePickerSheet = (props: Props) => {
  const { value, onClose, onConfirm, onChange } = props;
  return (
    <CustomBottomSheet visible onClose={onClose} snapToContent>
      <View className='px-4 pb-6'>
        <BottomSheetHeader handleClose={onClose} handleConfirm={onConfirm} />
        <View className='items-center'>
          <DateTimePicker
            mode='date'
            display='spinner'
            themeVariant='light'
            textColor={colors.black}
            accentColor={colors.primary[700]}
            style={{ width: '100%' }}
            value={value}
            onChange={onChange}
          />
        </View>
      </View>
    </CustomBottomSheet>
  );
};
