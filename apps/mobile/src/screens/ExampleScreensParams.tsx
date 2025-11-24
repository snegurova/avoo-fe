import { View, Text } from 'react-native';
import { Layout } from '@/shared/Layout';
import { ProfileScreens, ProfileScreenProps } from '@/types/navigation';

type Props = ProfileScreenProps<ProfileScreens.ExampleScreensParams>;

export const ExampleScreensParams = (props: Props) => {
  const { route } = props;

  const params = route.params;

  return (
    <Layout title={`Example Screens Params`} centerContent={true} showBack={true}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Example Screens Params {params?.id ?? 'No params'}</Text>
      </View>
    </Layout>
  );
};
