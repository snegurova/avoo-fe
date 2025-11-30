import { View, Text } from 'react-native';
import { Layout } from '@/shared/Layout';
import Button from '@/shared/Button/Button';
import { BottomBarScreens, ProfileScreens, ProfileScreenProps } from '@/types/navigation';
import { authHooks } from '@avoo/hooks';

type Props = ProfileScreenProps<ProfileScreens.Settings>;

export const SettingsScreen = (props: Props) => {
  const { navigation } = props;

  const { logoutMutation } = authHooks.useLogout();

  return (
    <Layout title='Settings' centerContent={true}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Settings Screen ⚙️</Text>
        <Button title='Logout' onPress={logoutMutation} />
        <Button
          title='Navigate with 4 '
          onPress={() =>
            navigation.navigate(BottomBarScreens.Profile, {
              screen: ProfileScreens.ExampleScreensParams,
              params: { id: 4 },
            })
          }
        />
        <Button
          title='Navigate without params'
          onPress={() =>
            navigation.navigate(BottomBarScreens.Profile, {
              screen: ProfileScreens.ExampleScreensParams,
            })
          }
        />
      </View>
    </Layout>
  );
};
