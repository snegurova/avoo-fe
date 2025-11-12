import { RootStackParamList } from '../types/navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import BottomBarNavigator from './BottomBarNavigator';
import { useAuthStore } from '@avoo/store';
import RegisterScreen from '../screens/RegisterScreen';
import StorybookScreen from '../screens/Storybook';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ConfirmCodeScreen from '../screens/ConfirmCodeScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppContainer = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? 'BottomBar' : 'LoginScreen'}
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen name='LoginScreen' component={LoginScreen} />
          <Stack.Screen name='RegisterScreen' component={RegisterScreen} />
          <Stack.Screen name='ForgotPasswordScreen' component={ForgotPasswordScreen} />
          <Stack.Screen name='ConfirmCodeScreen' component={ConfirmCodeScreen} />
          <Stack.Screen name='ResetPasswordScreen' component={ResetPasswordScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name='BottomBar' component={BottomBarNavigator} />
        </>
      )}

      {__DEV__ && <Stack.Screen name='Storybook' component={StorybookScreen} />}
    </Stack.Navigator>
  );
};

export default AppContainer;
