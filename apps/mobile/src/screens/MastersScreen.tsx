import { View } from 'react-native';
import { Layout } from '@/shared/Layout';
import { RootStackScreenProps, RootScreens } from '@/types/navigation';

type Props = RootStackScreenProps<RootScreens.MastersScreen>;

export const MastersScreen = (props: Props) => {
  const { navigation } = props;

  return (
    <Layout
      title='Edit Masters section/ with data'
      showBack={true}
      onBackPress={() => navigation.goBack()}
    >
      <View />
    </Layout>
  );
};

export default MastersScreen;
