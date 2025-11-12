import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  LoginScreen: undefined;
  ConfirmCodeScreen: { email: string },
  RegisterScreen: undefined;
  ForgotPasswordScreen: undefined;
  ResetPasswordScreen: undefined;
  BottomBar: NavigatorScreenParams<BottomBarStackParamList>;
  Storybook: undefined;
};

export type ProfileStackParamList = {
  Settings: undefined;
  ExampleScreensParams: { id: number } | undefined;
};

export type BottomBarStackParamList = {
  Home: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};




