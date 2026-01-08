import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import AppContainer from '@/navigation/AppContainer';
import { enableScreens } from 'react-native-screens';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@avoo/hooks';
import { PaperProvider } from 'react-native-paper';
import paperTheme from '@/theme/paper-theme';
import { GlobalBottomSheetProvider } from '@/shared/GlobalBottomSheetProvider/GlobalBottomSheetProvider';

import './global.css';

enableScreens();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <NavigationContainer>
          <QueryClientProvider client={queryClient}>
            <StatusBar style='auto' />
            <PaperProvider theme={paperTheme}>
              <GlobalBottomSheetProvider>
                <AppContainer />
              </GlobalBottomSheetProvider>
            </PaperProvider>
          </QueryClientProvider>
        </NavigationContainer>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
