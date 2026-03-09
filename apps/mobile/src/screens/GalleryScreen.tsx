import { View } from 'react-native';

import Layout from '@/shared/Layout/Layout';
import { RootScreens, RootStackScreenProps } from '@/types/navigation';

type Props = RootStackScreenProps<RootScreens.GalleryScreen>;

export const GalleryScreen = (props: Props) => {
  const { navigation } = props;

  return (
    <Layout title='Gallery' showBack={true} onBackPress={() => navigation.goBack()}>
      <View />
    </Layout>
  );
};

export default GalleryScreen;
