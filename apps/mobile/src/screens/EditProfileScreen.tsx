import { View } from 'react-native';
import { Layout } from '@/shared/Layout';
import { RootStackScreenProps, RootScreens } from '@/types/navigation';

type Props = RootStackScreenProps<RootScreens.EditProfileScreen>;

export const EditProfileScreen = (props: Props) => {
  const { navigation } = props;

  return (
    <Layout title='EditProfile' showBack={true} onBackPress={() => navigation.goBack()}>
      <View />
    </Layout>
  );
};

export default EditProfileScreen;
