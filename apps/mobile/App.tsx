import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { PaperProvider } from 'react-native-paper';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { enableScreens } from 'react-native-screens';

import { NavigationContainer } from '@react-navigation/native';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';

import { queryClient } from '@avoo/hooks';

import { fonts } from '@/fonts/fonts';
import AppContainer from '@/navigation/AppContainer';
import { NotificationPopUp } from '@/shared/NotificationPopUp/NotificationPopUp';
import paperTheme from '@/theme/paper-theme';

import './global.css';

enableScreens();

export default function App() {
  const [fontsLoaded] = useFonts(fonts);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <QueryClientProvider client={queryClient}>
            <StatusBar style='dark' />
            <PaperProvider theme={paperTheme}>
              <AppContainer />
              <NotificationPopUp />
            </PaperProvider>
          </QueryClientProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
