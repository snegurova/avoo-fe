import { Pressable } from 'react-native';
import { Text } from 'react-native-paper';

import { useNavigation } from '@react-navigation/native';

import { CustomBottomSheet } from '@/shared/CustomBottomSheet/CustomBottomSheet';
import { RootNavigationProp, RootScreens } from '@/types/navigation';

type Props = {
  visible: boolean;
  onClose: () => void;
};

export const CalendarSettingsSheet = (props: Props) => {
  const { visible, onClose } = props;
  const navigation = useNavigation<RootNavigationProp>();

  const handleWorkingSchedulePress = () => {
    navigation.navigate(RootScreens.WorkingScheduleScreen);
    onClose();
  };

  const handleScheduleExceptionPress = () => {
    navigation.navigate(RootScreens.ScheduleExceptionScreen);
    onClose();
  };

  const handleComboServiceTimePress = () => {
    navigation.navigate(RootScreens.ComboServiceTimeScreen);
    onClose();
  };

  return (
    <CustomBottomSheet visible={visible} onClose={onClose} snapToContent>
      <Pressable className='px-6 py-4' onPress={handleWorkingSchedulePress}>
        <Text variant='titleMedium'>Working schedule</Text>
      </Pressable>
      <Pressable className='px-6 py-4' onPress={handleScheduleExceptionPress}>
        <Text variant='titleMedium'>Schedule exception</Text>
      </Pressable>
      <Pressable className='px-6 py-4' onPress={handleComboServiceTimePress}>
        <Text variant='titleMedium'>Combo service time</Text>
      </Pressable>
    </CustomBottomSheet>
  );
};
