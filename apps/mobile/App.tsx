import * as React from 'react';
import { SafeAreaView, Text, View, Pressable } from 'react-native';
import { StatusBar } from 'expo-status-bar';

// export default function App() {
//   return (
//     <SafeAreaView style={{ flex: 1 }}>
//       <StatusBar style="auto" />
//       <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
//         <Text style={{ fontSize: 24, fontWeight: '700' }}>AVOO Mobile (Expo)</Text>
//         <Pressable onPress={() => console.log('Hello from mobile!')} style={{ padding: 12 }}>
//           <Text>Tap me</Text>
//         </Pressable>
//       </View>
//     </SafeAreaView>
//   );
// }

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import AppContainer from './src/navigation/AppContainer';
import { enableScreens } from 'react-native-screens';

enableScreens();


export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>

        <StatusBar style="auto" />
        <AppContainer />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
