import Layout from '@/shared/Layout/Layout';
import { RootStackScreenProps, RootScreens } from '@/types/navigation';
import { Text } from 'react-native';

type Props = RootStackScreenProps<RootScreens.AddPostScreen>;

export const AddPostScreen = (props: Props) => {
  const { navigation } = props;

  return (
    <Layout showBack={true} onBackPress={() => navigation.goBack()}>
      <Text>Add Post</Text>
    </Layout>
  );
};

export default AddPostScreen;
