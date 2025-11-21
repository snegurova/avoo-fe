import { View } from 'react-native';
import { Layout } from '@/shared/Layout';
import { RootStackScreenProps, RootScreens } from '@/types/navigation';

export const WorkingHoursScreen = ({
  navigation,
}: RootStackScreenProps<RootScreens.WorkingHoursScreen>) => {
  return (
    <Layout title='Working hours' showBack={true} onBackPress={() => navigation.goBack()}>
      <View />
    </Layout>
  );
};

export default WorkingHoursScreen;
