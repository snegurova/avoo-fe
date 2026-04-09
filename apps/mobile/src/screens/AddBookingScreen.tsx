import { CreateOrderForm } from '@/components/CreateOrderForm/CreateOrderForm';
import Layout from '@/shared/Layout/Layout';
import { RootScreens, RootStackScreenProps } from '@/types/navigation';

type Props = RootStackScreenProps<RootScreens.AddBookingScreen>;

export const AddBookingScreen = (props: Props) => {
  const { navigation } = props;

  return (
    <Layout showBack={true} onBackPress={() => navigation.goBack()}>
      <CreateOrderForm navigation={navigation} />
    </Layout>
  );
};

export default AddBookingScreen;
