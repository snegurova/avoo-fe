import { Pressable } from 'react-native';

import { useNavigation } from '@react-navigation/native';

import { colors } from '@avoo/design-tokens';

import { CalendarSection } from '@/components/CalendarSection/CalendarSection';
import { SettingsIcon } from '@/icons';
import Layout from '@/shared/Layout/Layout';
import { RootNavigationProp, RootScreens } from '@/types/navigation';

export const CalendarScreen = () => {
  const navigation = useNavigation<RootNavigationProp>();

  return (
    <Layout
      hasBottomTab={true}
      isScrollableDisabled
      leftContent={
        <Pressable
          className='w-11 h-11 justify-center items-center'
          onPress={() => navigation.navigate(RootScreens.WorkingScheduleScreen)}
        >
          <SettingsIcon size={24} color={colors.black} />
        </Pressable>
      }
    >
      <CalendarSection />
    </Layout>
  );
};
