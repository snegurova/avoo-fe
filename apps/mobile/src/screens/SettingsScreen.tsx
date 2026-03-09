import { Text, View } from 'react-native';

import { authHooks } from '@avoo/hooks';

import Button from '@/shared/Button/Button';
import Layout from '@/shared/Layout/Layout';

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
