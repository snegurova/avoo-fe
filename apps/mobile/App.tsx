import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppContainer from './src/navigation/AppContainer';
import { enableScreens } from 'react-native-screens';

enableScreens();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <StatusBar style='auto' />
        <AppContainer />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
