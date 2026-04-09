import { View } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { BookIcon, CalendarIcon, CoPresentIcon, GroupsIcon, HomeIcon } from '@/icons';
import { CalendarScreen } from '@/screens/CalendarScreen';
import { ClientsScreen } from '@/screens/ClientsScreen';
import { HomeScreen } from '@/screens/HomeScreen';
import MastersScreen from '@/screens/MastersScreen';
import { ServicesScreen } from '@/screens/ServicesScreen';
import { BottomBarScreens, BottomBarStackParamList } from '@/types/navigation';

import { BottomBar } from '../components/BottomBar/BottomBar';

const BottomTab = createBottomTabNavigator<BottomBarStackParamList>();

const BottomBarNavigator = () => {
  return (
    <View className='flex-1'>
      <BottomTab.Navigator
        initialRouteName={BottomBarScreens.Home}
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <BottomBar {...props} />}
      >
        <BottomTab.Screen
          name={BottomBarScreens.Home}
          component={HomeScreen}
          options={{
            tabBarLabel: 'Home',
            tabBarIcon: ({ color }) => <HomeIcon size={24} color={color} />,
          }}
        />
        <BottomTab.Screen
          name={BottomBarScreens.Calendar}
          component={CalendarScreen}
          options={{
            tabBarLabel: 'Calendar',
            tabBarIcon: ({ color }) => <CalendarIcon size={24} color={color} />,
          }}
        />
        <BottomTab.Screen
          name={BottomBarScreens.Clients}
          component={ClientsScreen}
          options={{
            tabBarLabel: 'Clients',
            tabBarIcon: ({ color }) => <CoPresentIcon size={24} color={color} />,
          }}
        />
        <BottomTab.Screen
          name={BottomBarScreens.Services}
          component={ServicesScreen}
          options={{
            tabBarLabel: 'Services',
            tabBarIcon: ({ color }) => <BookIcon size={24} color={color} />,
          }}
        />
        <BottomTab.Screen
          name={BottomBarScreens.Masters}
          component={MastersScreen}
          options={{
            tabBarLabel: 'Masters',
            tabBarIcon: ({ color }) => <GroupsIcon size={24} color={color} />,
          }}
        />
      </BottomTab.Navigator>
    </View>
  );
};

export default BottomBarNavigator;
