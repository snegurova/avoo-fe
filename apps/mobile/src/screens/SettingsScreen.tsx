import { View, Text } from 'react-native';
import { Layout } from '@/shared/Layout';
import Button from '@/shared/Button/Button';
import { useAuthStore } from '@avoo/store';
import { BottomBarScreens, ProfileScreens, ProfileScreenProps } from '@/types/navigation';

export const SettingsScreen = ({ navigation }: ProfileScreenProps<ProfileScreens.Settings>) => {
  const setIsAuthenticated = useAuthStore((state) => state.setIsAuthenticated);

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Layout title='Settings' centerContent={true}>
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Settings Screen ⚙️</Text>
        <Button title='Logout' onPress={handleLogout} />
        <Button
          title='Navigate with 4 '
          onPress={() => navigation.navigate(BottomBarScreens.Profile, { screen: ProfileScreens.ExampleScreensParams, params: { id: 4 } })}
        />
        <Button
          title='Navigate without params'
          onPress={() => navigation.navigate(BottomBarScreens.Profile, { screen: ProfileScreens.ExampleScreensParams })}
        />
      </View>
    </Layout>
  );
};
