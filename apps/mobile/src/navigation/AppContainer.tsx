import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { useAuthStore } from '@avoo/store';

import AddBookingScreen from '@/screens/AddBookingScreen';
import AddPostScreen from '@/screens/AddPostScreen';
import CertificatesScreen from '@/screens/CertificatesScreen';
import ComboServiceTimeScreen from '@/screens/ComboServiceTimeScreen';
import ConfirmCodeScreen from '@/screens/ConfirmCodeScreen';
import EditLanguagesScreen from '@/screens/EditLanguagesScreen';
import EditProfileScreen from '@/screens/EditProfileScreen';
import ForgotPasswordScreen from '@/screens/ForgotPasswordScreen';
import GalleryScreen from '@/screens/GalleryScreen';
import LoginScreen from '@/screens/LoginScreen';
import PostsScreen from '@/screens/PostsScreen';
import ProfileScreen from '@/screens/ProfileScreen';
import RegisterScreen from '@/screens/RegisterScreen';
import ResetPasswordScreen from '@/screens/ResetPasswordScreen';
import ScheduleExceptionScreen from '@/screens/ScheduleExceptionScreen';
import StorybookScreen from '@/screens/Storybook';
import WorkingHoursScreen from '@/screens/WorkingHoursScreen';
import WorkingScheduleScreen from '@/screens/WorkingScheduleScreen';
import { RootScreens, RootStackParamList } from '@/types/navigation';

import BottomBarNavigator from './BottomBarNavigator';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppContainer = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? RootScreens.BottomBar : RootScreens.LoginScreen}
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen name={RootScreens.LoginScreen} component={LoginScreen} />
          <Stack.Screen name={RootScreens.RegisterScreen} component={RegisterScreen} />
          <Stack.Screen name={RootScreens.ForgotPasswordScreen} component={ForgotPasswordScreen} />
          <Stack.Screen name={RootScreens.ConfirmCodeScreen} component={ConfirmCodeScreen} />
          <Stack.Screen name={RootScreens.ResetPasswordScreen} component={ResetPasswordScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name={RootScreens.BottomBar} component={BottomBarNavigator} />
          <Stack.Screen name={RootScreens.CertificatesScreen} component={CertificatesScreen} />
          <Stack.Screen name={RootScreens.WorkingHoursScreen} component={WorkingHoursScreen} />
          <Stack.Screen name={RootScreens.PostsScreen} component={PostsScreen} />
          <Stack.Screen name={RootScreens.GalleryScreen} component={GalleryScreen} />
          <Stack.Screen name={RootScreens.EditLanguagesScreen} component={EditLanguagesScreen} />
          <Stack.Screen name={RootScreens.EditProfileScreen} component={EditProfileScreen} />
          <Stack.Screen name={RootScreens.ProfileScreen} component={ProfileScreen} />
          <Stack.Screen name={RootScreens.AddPostScreen} component={AddPostScreen} />
          <Stack.Screen name={RootScreens.AddBookingScreen} component={AddBookingScreen} />
          <Stack.Screen
            name={RootScreens.WorkingScheduleScreen}
            component={WorkingScheduleScreen}
          />
          <Stack.Screen
            name={RootScreens.ScheduleExceptionScreen}
            component={ScheduleExceptionScreen}
          />
          <Stack.Screen
            name={RootScreens.ComboServiceTimeScreen}
            component={ComboServiceTimeScreen}
          />
        </>
      )}

      {__DEV__ && <Stack.Screen name={RootScreens.Storybook} component={StorybookScreen} />}
    </Stack.Navigator>
  );
};

export default AppContainer;
