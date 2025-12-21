import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppContainer from '@/navigation/AppContainer';
import { enableScreens } from 'react-native-screens';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@avoo/hooks';
import { PaperProvider } from 'react-native-paper';
import paperTheme from '@/theme/paper-theme';
import { setClearQueryClientCallback } from '@avoo/axios';

import './global.css';

enableScreens();

setClearQueryClientCallback(() => {
  queryClient.clear();
});

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <QueryClientProvider client={queryClient}>
          <StatusBar style='auto' />
          <PaperProvider theme={paperTheme}>
            <AppContainer />
          </PaperProvider>
        </QueryClientProvider>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
