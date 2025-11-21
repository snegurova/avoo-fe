import { View } from 'react-native';
import { Layout } from '@/shared/Layout';
import { RootStackScreenProps, RootScreens } from '@/types/navigation';

export const EditLanguagesScreen = ({
  navigation,
}: RootStackScreenProps<RootScreens.EditLanguagesScreen>) => {
  return (
    <Layout title='Edit Languages' showBack={true} onBackPress={() => navigation.goBack()}>
      <View />
    </Layout>
  );
};

export default EditLanguagesScreen;
