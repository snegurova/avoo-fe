import { Text } from 'react-native';

import Layout from '@/shared/Layout/Layout';
import { RootScreens, RootStackScreenProps } from '@/types/navigation';

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
