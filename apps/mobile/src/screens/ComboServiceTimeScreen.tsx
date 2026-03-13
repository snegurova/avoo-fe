import { View } from 'react-native';

import Layout from '@/shared/Layout/Layout';
import { RootScreens, RootStackScreenProps } from '@/types/navigation';

type Props = RootStackScreenProps<RootScreens.ComboServiceTimeScreen>;

export const ComboServiceTimeScreen = (props: Props) => {
  const { navigation } = props;
  return (
    <Layout title='Combo service time' showBack onBackPress={() => navigation.goBack()}>
      <View />
    </Layout>
  );
};

export default ComboServiceTimeScreen;
