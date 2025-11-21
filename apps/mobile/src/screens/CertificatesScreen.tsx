import { View } from 'react-native';
import { Layout } from '@/shared/Layout';
import { RootStackScreenProps, RootScreens } from '@/types/navigation';

export const CertificatesScreen = ({
  navigation,
}: RootStackScreenProps<RootScreens.CertificatesScreen>) => {
  return (
    <Layout title='Certificates' showBack={true} onBackPress={() => navigation.goBack()}>
      <View />
    </Layout>
  );
};

export default CertificatesScreen;
