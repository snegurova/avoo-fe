import { View } from 'react-native';
import  Layout from '@/shared/Layout/Layout';
import { RootStackScreenProps, RootScreens } from '@/types/navigation';

type Props = RootStackScreenProps<RootScreens.EditLanguagesScreen>;

export const EditLanguagesScreen = (props: Props) => {
  const { navigation } = props;

  return (
    <Layout title='Edit Languages' showBack={true} onBackPress={() => navigation.goBack()}>
      <View />
    </Layout>
  );
};

export default EditLanguagesScreen;
