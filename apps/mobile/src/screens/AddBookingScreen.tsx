import { Text } from 'react-native';

import Layout from '@/shared/Layout/Layout';
import { RootScreens, RootStackScreenProps } from '@/types/navigation';

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
