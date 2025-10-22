import * as React from 'react'
import { Text, TouchableOpacity, View } from 'react-native'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import {
  BottomBarStackParamList,
  RootStackParamList,
} from '../types/navigation'
import { AntDesign } from '@expo/vector-icons'
import { NavigationProp, useNavigation } from '@react-navigation/native'
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
  const navigation = useNavigation<NavigationProp<RootStackParamList>>()

  return (
    <View style={{ flex: 1 }}>
      <BottomTab.Navigator
        initialRouteName="Home"

      >
        <BottomTab.Screen
          name="Home"
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Text style={{ color }}>🏠</Text>
            ),
          }}
        />
        <BottomTab.Screen
          name="Profile"
          component={ProfileStackNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({ color, size }) => (
              <Text style={{ color }}>⚙️</Text>
            ),
          }}
        />
      </BottomTab.Navigator>

      <TouchableOpacity
        style={{
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
        }}
        onPress={() => console.log('plus button pressed')}
        activeOpacity={0.8}
      >
        <AntDesign name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>
    </View>
  )
}

export default BottomBarNavigator