import { View } from 'react-native';
import { Layout } from '@/shared/Layout';
import { RootStackScreenProps, RootScreens } from '@/types/navigation';

export const EditProfileScreen = ({
  navigation,
}: RootStackScreenProps<RootScreens.EditProfileScreen>) => {
  return (
    <Layout title='EditProfile' showBack={true} onBackPress={() => navigation.goBack()}>
      <View />
    </Layout>
  );
};

export default EditProfileScreen;

