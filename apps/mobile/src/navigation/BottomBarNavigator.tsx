import { Text, TouchableOpacity, View, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { BottomBarScreens, BottomBarStackParamList, ProfileScreens, ProfileStackParamList } from '@/types/navigation';
import { MaterialIcons } from '@/shared/icons';
import { HomeScreen } from '@/screens/HomeScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ExampleScreensParams } from '@/screens/ExampleScreensParams';

const BottomTab = createBottomTabNavigator<BottomBarStackParamList>();
const ProfileStack = createNativeStackNavigator<ProfileStackParamList>();

export const ProfileStackNavigator = () => {
  return (
    <ProfileStack.Navigator
      initialRouteName={ProfileScreens.Settings}
      screenOptions={{
        headerShown: false,
      }}
    >
      <ProfileStack.Screen name={ProfileScreens.Settings} component={SettingsScreen} />
      <ProfileStack.Screen name={ProfileScreens.ExampleScreensParams} component={ExampleScreensParams} />
    </ProfileStack.Navigator>
  );
};

const BottomBarNavigator = () => {
  return (
    <View style={styles.container}>
      <BottomTab.Navigator initialRouteName={BottomBarScreens.Home}>
        <BottomTab.Screen
          name={BottomBarScreens.Home}
          component={HomeScreen}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => <Text style={{ color }}>🏠</Text>,
          }}
        />
        <BottomTab.Screen
          name={BottomBarScreens.Profile}
          component={ProfileStackNavigator}
          options={{
            headerShown: false,
            tabBarIcon: ({ color }) => <Text style={{ color }}>⚙️</Text>,
          }}
        />
      </BottomTab.Navigator>

      <TouchableOpacity
        style={styles.floatingButton}
        activeOpacity={0.8}
      >
        <MaterialIcons name='add' size={24} color='#FFFFFF' />
      </TouchableOpacity>
    </View>
  );
};

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
});

export default BottomBarNavigator;
