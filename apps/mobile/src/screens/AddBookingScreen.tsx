import Layout from '@/shared/Layout/Layout';
import { RootStackScreenProps, RootScreens } from '@/types/navigation';

type Props = RootStackScreenProps<RootScreens.AddBookingScreen>;

export const AddBookingScreen = (props: Props) => {
  const { navigation } = props;

  return (
    <Layout showBack={true} onBackPress={() => navigation.goBack()}>
      {null}
    </Layout>
  );
};

export default AddBookingScreen;

