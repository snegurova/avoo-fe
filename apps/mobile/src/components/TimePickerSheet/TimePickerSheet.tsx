import { View } from 'react-native';

import DateTimePicker, { type DateTimePickerEvent } from '@react-native-community/datetimepicker';

import { colors } from '@avoo/design-tokens';

import { BottomSheetHeader } from '@/shared/BottomSheetHeader/BottomSheetHeader';
import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';

type Props = {
  value: Date;
  onClose: () => void;
  onConfirm: () => void;
  onChange: (_: DateTimePickerEvent, picked?: Date) => void;
};

export const TimePickerSheet = ({ value, onClose, onConfirm, onChange }: Props) => (
  <CustomBottomSheet visible onClose={onClose} snapToContent>
    <View className='px-4 pb-6'>
      <BottomSheetHeader handleClose={onClose} handleConfirm={onConfirm} />
      <View className='items-center'>
        <DateTimePicker
          mode='time'
          display='spinner'
          themeVariant='light'
          textColor={colors.black}
          accentColor={colors.primary[700]}
          minuteInterval={15}
          is24Hour
          style={{ width: '100%' }}
          value={value}
          onChange={onChange}
        />
      </View>
    </View>
  </CustomBottomSheet>
);
