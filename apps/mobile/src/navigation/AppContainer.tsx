import { RootScreens, RootStackParamList } from '@/types/navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '@/screens/LoginScreen';
import BottomBarNavigator from './BottomBarNavigator';
import { useAuthStore } from '@avoo/store';
import RegisterScreen from '@/screens/RegisterScreen';
import StorybookScreen from '@/screens/Storybook';
import ForgotPasswordScreen from '@/screens/ForgotPasswordScreen';
import ConfirmCodeScreen from '@/screens/ConfirmCodeScreen';
import ResetPasswordScreen from '@/screens/ResetPasswordScreen';
import MastersScreen from '@/screens/MastersScreen';
import AddMasterScreen from '@/screens/AddMasterScreen';
import CertificatesScreen from '@/screens/CertificatesScreen';
import WorkingHoursScreen from '@/screens/WorkingHoursScreen';
import PostsScreen from '@/screens/PostsScreen';
import GalleryScreen from '@/screens/GalleryScreen';
import EditLanguagesScreen from '@/screens/EditLanguagesScreen';
import EditProfileScreen from '@/screens/EditProfileScreen';
import AddPostScreen from '@/screens/AddPostScreen';
import AddBookingScreen from '@/screens/AddBookingScreen';

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
          <Stack.Screen name={RootScreens.MastersScreen} component={MastersScreen} />
          <Stack.Screen name={RootScreens.AddMasterScreen} component={AddMasterScreen} />
          <Stack.Screen name={RootScreens.CertificatesScreen} component={CertificatesScreen} />
          <Stack.Screen name={RootScreens.WorkingHoursScreen} component={WorkingHoursScreen} />
          <Stack.Screen name={RootScreens.PostsScreen} component={PostsScreen} />
          <Stack.Screen name={RootScreens.GalleryScreen} component={GalleryScreen} />
          <Stack.Screen name={RootScreens.EditLanguagesScreen} component={EditLanguagesScreen} />
          <Stack.Screen name={RootScreens.EditProfileScreen} component={EditProfileScreen} />
          <Stack.Screen name={RootScreens.AddPostScreen} component={AddPostScreen} />
          <Stack.Screen name={RootScreens.AddBookingScreen} component={AddBookingScreen} />
        </>
      )}

      {__DEV__ && <Stack.Screen name={RootScreens.Storybook} component={StorybookScreen} />}
    </Stack.Navigator>
  );
};

export default AppContainer;
