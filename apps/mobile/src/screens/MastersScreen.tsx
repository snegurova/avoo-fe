import { Button } from 'react-native';
import Layout from '@/shared/Layout/Layout';
import { RootStackScreenProps, RootScreens } from '@/types/navigation';

type Props = RootStackScreenProps<RootScreens.MastersScreen>;

export default function MastersScreen(props: Props) {
  const { navigation } = props;

  return (
    <Layout
      title='Edit Masters section/ with data'
      showBack={true}
      onBackPress={() => navigation.goBack()}
    >
      <Button
        title='To create master'
        onPress={() => navigation.navigate(RootScreens.AddMasterScreen)}
      />
    </Layout>
  );
};
