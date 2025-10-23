import { Text, TouchableOpacity, View, StyleSheet } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  BottomBarStackParamList,
} from '../types/navigation'
import { AntDesign } from '@expo/vector-icons'
import { HomeScreen } from '../screens/HomeScreen'
import { SettingsScreen } from '../screens/SettingsScreen'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { ExampleScreensParams } from '../screens/ExampleScreensParams'

const BottomTab = createBottomTabNavigator<BottomBarStackParamList>()
const ProfileStack = createNativeStackNavigator();

export const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator
    initialRouteName="Settings"
    screenOptions={{
      headerShown: false,
    }}
    >
      <ProfileStack.Screen name="Settings" component={SettingsScreen} />
      <ProfileStack.Screen name="ExampleScreensParams" component={ExampleScreensParams} />
    </ProfileStack.Navigator>
  );
};

const BottomBarNavigator = () => {
  return (
    <View style={styles.container}>
      <BottomTab.Navigator
        initialRouteName="Home"
      >
        <BottomTab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Text style={{ color }}>🏠</Text>
            ),
          }}
        />
        <BottomTab.Screen
          name="Profile"
          component={ProfileStackNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => (
              <Text style={{ color }}>⚙️</Text>
            ),
          }}
        />
      </BottomTab.Navigator>

      <TouchableOpacity
        style={styles.floatingButton}
        onPress={() => console.log('plus button pressed')}
        activeOpacity={0.8}
      >
        <AntDesign name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  floatingButton: {
    backgroundColor: '#2563EB',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 28,
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
})

export default BottomBarNavigator