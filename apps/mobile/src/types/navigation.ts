import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

export enum RootScreens {
  LoginScreen = 'LoginScreen',
  ConfirmCodeScreen = 'ConfirmCodeScreen',
  RegisterScreen = 'RegisterScreen',
  ForgotPasswordScreen = 'ForgotPasswordScreen',
  ResetPasswordScreen = 'ResetPasswordScreen',
  BottomBar = 'BottomBar',
  Storybook = 'Storybook',
  MastersScreen = 'MastersScreen',
  CertificatesScreen = 'CertificatesScreen',
  WorkingHoursScreen = 'WorkingHoursScreen',
  PostsScreen = 'PostsScreen',
  GalleryScreen = 'GalleryScreen',
  EditLanguagesScreen = 'EditLanguagesScreen',
  EditProfileScreen = 'EditProfileScreen',
}

export enum BottomBarScreens {
  Home = 'Home',
  Profile = 'Profile',
}

export enum ProfileScreens {
  Settings = 'Settings',
  ExampleScreensParams = 'ExampleScreensParams',
}

export type ProfileStackParamList = {
  [ProfileScreens.Settings]: undefined;
  [ProfileScreens.ExampleScreensParams]: { id: number } | undefined;
};

export type BottomBarStackParamList = {
  [BottomBarScreens.Home]: undefined;
  [BottomBarScreens.Profile]: NavigatorScreenParams<ProfileStackParamList>;
};

export type RootStackParamList = {
  [RootScreens.LoginScreen]: undefined;
  [RootScreens.ConfirmCodeScreen]: { email: string };
  [RootScreens.RegisterScreen]: undefined;
  [RootScreens.ForgotPasswordScreen]: undefined;
  [RootScreens.ResetPasswordScreen]: undefined;
  [RootScreens.BottomBar]: NavigatorScreenParams<BottomBarStackParamList>;
  [RootScreens.Storybook]: undefined;
  [RootScreens.MastersScreen]: undefined;
  [RootScreens.CertificatesScreen]: undefined;
  [RootScreens.WorkingHoursScreen]: undefined;
  [RootScreens.PostsScreen]: undefined;
  [RootScreens.GalleryScreen]: undefined;
  [RootScreens.EditLanguagesScreen]: undefined;
  [RootScreens.EditProfileScreen]: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type BottomBarScreenProps<T extends keyof BottomBarStackParamList> = CompositeScreenProps<
  BottomTabScreenProps<BottomBarStackParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;

export type ProfileScreenProps<T extends keyof ProfileStackParamList> = CompositeScreenProps<
  NativeStackScreenProps<ProfileStackParamList, T>,
  CompositeScreenProps<
    BottomTabScreenProps<BottomBarStackParamList, BottomBarScreens.Profile>,
    RootStackScreenProps<keyof RootStackParamList>
  >
>;
