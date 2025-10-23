import { View, Text } from 'react-native';
import { Layout } from '../shared/Layout';
import Button from '../shared/Button';
import { useAuthStore } from '@avoo/store';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { BottomBarStackParamList } from '../types/navigation';

export const SettingsScreen = () => {
  const setIsAuthenticated = useAuthStore(state => state.setIsAuthenticated);

  const { navigate } = useNavigation<NavigationProp<BottomBarStackParamList>>();

  const handleLogout = () => {
    setIsAuthenticated(false);
  }


  return (
    <Layout title="Settings" centerContent={true}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Settings Screen ⚙️</Text>
        <Button title="Logout" onPress={handleLogout} />
        <Button title="Navigate with 4 " onPress={() => navigate('Profile', { screen: 'ExampleScreensParams', params: { id: 4 } })} />
        <Button title="Navigate without params" onPress={() => navigate('Profile', { screen: 'ExampleScreensParams'})} />
      </View>
    </Layout>

  );
};
