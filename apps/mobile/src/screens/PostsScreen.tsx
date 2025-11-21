import { View } from 'react-native';
import { Layout } from '@/shared/Layout';
import { RootStackScreenProps, RootScreens } from '@/types/navigation';

export const PostsScreen = ({ navigation }: RootStackScreenProps<RootScreens.PostsScreen>) => {
  return (
    <Layout title='Posts' showBack={true} onBackPress={() => navigation.goBack()}>
      <View />
    </Layout>
  );
};

export default PostsScreen;
