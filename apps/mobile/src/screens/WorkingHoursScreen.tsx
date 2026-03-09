import { View } from 'react-native';

import Layout from '@/shared/Layout/Layout';
import { RootScreens, RootStackScreenProps } from '@/types/navigation';

type Props = RootStackScreenProps<RootScreens.WorkingHoursScreen>;

export const WorkingHoursScreen = (props: Props) => {
  const { navigation } = props;

  return (
    <Layout title='Working hours' showBack={true} onBackPress={() => navigation.goBack()}>
      <View />
    </Layout>
  );
};

export default WorkingHoursScreen;
