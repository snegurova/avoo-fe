import Layout from '@/shared/Layout/Layout';
import { RootStackScreenProps, RootScreens } from '@/types/navigation';
import { Text } from 'react-native';

type Props = RootStackScreenProps<RootScreens.AddBookingScreen>;

export const AddBookingScreen = (props: Props) => {
  const { navigation } = props;

  return (
    <Layout showBack={true} onBackPress={() => navigation.goBack()}>
      <Text>Add Booking</Text>
    </Layout>
  );
};

export default AddBookingScreen;
