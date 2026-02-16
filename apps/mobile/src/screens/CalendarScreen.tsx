import { Pressable } from 'react-native';
import Layout from '@/shared/Layout/Layout';
import { CalendarSection } from '@/components/CalendarSection/CalendarSection';
import { CalendarSettingsSheet } from '@/components/CalendarSettingsSheet/CalendarSettingsSheet';
import { SettingsIcon } from '@/icons';
import { colors } from '@avoo/design-tokens';
import { utils } from '@avoo/hooks';

export const CalendarScreen = () => {
  const { value: settingsSheetVisible, enable, disable } = utils.useBooleanState(false);
  return (
    <>
      <Layout
        hasBottomTab={true}
        isScrollableDisabled
        leftContent={
          <Pressable className='w-11 h-11 justify-center items-center' onPress={enable}>
            <SettingsIcon size={24} color={colors.black} />
          </Pressable>
        }
      >
        <CalendarSection />
      </Layout>
      <CalendarSettingsSheet visible={settingsSheetVisible} onClose={disable} />
    </>
  );
};
