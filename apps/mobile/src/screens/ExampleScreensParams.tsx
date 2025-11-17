import { View, Text } from 'react-native';
import { Layout } from '@/shared/Layout';
import { ProfileScreens, ProfileScreenProps } from '@/types/navigation';

export const ExampleScreensParams = ({ route }: ProfileScreenProps<ProfileScreens.ExampleScreensParams>) => {
  const params = route.params;

  return (
    <Layout title={`Example Screens Params`} centerContent={true} showBack={true}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Example Screens Params {params?.id ?? 'No params'}</Text>
      </View>
    </Layout>
  );
};
