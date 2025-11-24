import { View } from 'react-native';
import { Layout } from '@/shared/Layout';
import { RootStackScreenProps, RootScreens } from '@/types/navigation';

type Props = RootStackScreenProps<RootScreens.CertificatesScreen>;

export const CertificatesScreen = (props: Props) => {
  const { navigation } = props;

  return (
    <Layout title='Certificates' showBack={true} onBackPress={() => navigation.goBack()}>
      <View />
    </Layout>
  );
};

export default CertificatesScreen;
