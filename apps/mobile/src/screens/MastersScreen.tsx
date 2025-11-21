import { View } from 'react-native';
import { Layout } from '@/shared/Layout';
import { RootStackScreenProps, RootScreens } from '@/types/navigation';

export const MastersScreen = ({ navigation }: RootStackScreenProps<RootScreens.MastersScreen>) => {
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
