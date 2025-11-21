import { View } from 'react-native';
import { Layout } from '@/shared/Layout';
import { RootStackScreenProps, RootScreens } from '@/types/navigation';

export const GalleryScreen = ({ navigation }: RootStackScreenProps<RootScreens.GalleryScreen>) => {
  return (
    <Layout title='Gallery' showBack={true} onBackPress={() => navigation.goBack()}>
      <View />
    </Layout>
  );
};

export default GalleryScreen;
