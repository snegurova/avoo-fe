import { Pressable } from 'react-native';
import { Text } from 'react-native-paper';
import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';

type Props = {
  visible: boolean;
  onClose: () => void;
};

const MENU_ITEMS = [
  { id: 'working-schedule', label: 'Working schedule' },
  { id: 'schedule-exception', label: 'Schedule exception' },
  { id: 'combo-service-time', label: 'Combo service time' },
] as const;

export const CalendarSettingsSheet = (props: Props) => {
  const { visible, onClose } = props;
  return (
    <CustomBottomSheet visible={visible} onClose={onClose} snapToContent>
      {MENU_ITEMS.map((item) => (
        <Pressable key={item.id} className='px-6 py-4' onPress={() => {}}>
          <Text variant='titleMedium'>{item.label}</Text>
        </Pressable>
      ))}
    </CustomBottomSheet>
  );
};
