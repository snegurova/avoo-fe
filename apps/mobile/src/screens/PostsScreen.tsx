import { View } from 'react-native';
import  Layout from '@/shared/Layout/Layout';
import { RootStackScreenProps, RootScreens } from '@/types/navigation';

type Props = RootStackScreenProps<RootScreens.PostsScreen>;

export const PostsScreen = (props: Props) => {
  const { navigation } = props;
  return (
    <Layout title='Posts' showBack={true} onBackPress={() => navigation.goBack()}>
      <View />
    </Layout>
  );
};

export default PostsScreen;
