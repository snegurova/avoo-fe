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
        </>
      )}

      {__DEV__ && <Stack.Screen name={RootScreens.Storybook} component={StorybookScreen} />}
    </Stack.Navigator>
  );
};

export default AppContainer;
