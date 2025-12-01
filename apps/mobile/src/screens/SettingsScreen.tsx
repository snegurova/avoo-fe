import { View, Text } from 'react-native';
import { Layout } from '@/shared/Layout';
import Button from '@/shared/Button/Button';
import { authHooks } from '@avoo/hooks';


export const SettingsScreen = () => {
  const { logoutMutation } = authHooks.useLogout();

  return (
    <Layout title='Settings' centerContent={true}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Settings Screen ⚙️</Text>
        <Button title='Logout' onPress={logoutMutation} />
      </View>
    </Layout>
  );
};
