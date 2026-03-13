import { View } from 'react-native';

import Layout from '@/shared/Layout/Layout';
import { RootScreens, RootStackScreenProps } from '@/types/navigation';

type Props = RootStackScreenProps<RootScreens.ScheduleExceptionScreen>;

export const ScheduleExceptionScreen = (props: Props) => {
  const { navigation } = props;
  return (
    <Layout title='Schedule exception' showBack onBackPress={() => navigation.goBack()}>
      <View />
    </Layout>
  );
};

export default ScheduleExceptionScreen;
