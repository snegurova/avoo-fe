import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackNavigationProp, NativeStackScreenProps } from '@react-navigation/native-stack';

export enum RootScreens {
  LoginScreen = 'LoginScreen',
  ConfirmCodeScreen = 'ConfirmCodeScreen',
  RegisterScreen = 'RegisterScreen',
  ForgotPasswordScreen = 'ForgotPasswordScreen',
  ResetPasswordScreen = 'ResetPasswordScreen',
  BottomBar = 'BottomBar',
  Storybook = 'Storybook',
  CertificatesScreen = 'CertificatesScreen',
  WorkingHoursScreen = 'WorkingHoursScreen',
  PostsScreen = 'PostsScreen',
  GalleryScreen = 'GalleryScreen',
  EditLanguagesScreen = 'EditLanguagesScreen',
  EditProfileScreen = 'EditProfileScreen',
  AddPostScreen = 'AddPostScreen',
  AddBookingScreen = 'AddBookingScreen',
  ProfileScreen = 'ProfileScreen',
}

export enum BottomBarScreens {
  Home = 'Home',
  Calendar = 'Calendar',
  Clients = 'Clients',
  Services = 'Services',
  Masters = 'Masters',
  Posts = 'Posts',
  Profile = 'Profile',
}

export enum ProfileScreens {
  Settings = 'Settings',
}

export type BottomBarStackParamList = {
  [BottomBarScreens.Home]: undefined;
  [BottomBarScreens.Calendar]: undefined;
  [BottomBarScreens.Clients]: undefined;
  [BottomBarScreens.Services]: undefined;
  [BottomBarScreens.Masters]: undefined;
  [BottomBarScreens.Posts]: undefined;
};

export type RootStackParamList = {
  [RootScreens.LoginScreen]: undefined;
  [RootScreens.ConfirmCodeScreen]: { email: string };
  [RootScreens.RegisterScreen]: undefined;
  [RootScreens.ForgotPasswordScreen]: undefined;
  [RootScreens.ResetPasswordScreen]: undefined;
  [RootScreens.BottomBar]: NavigatorScreenParams<BottomBarStackParamList>;
  [RootScreens.Storybook]: undefined;
  [RootScreens.CertificatesScreen]: undefined;
  [RootScreens.WorkingHoursScreen]: undefined;
  [RootScreens.PostsScreen]: undefined;
  [RootScreens.GalleryScreen]: undefined;
  [RootScreens.EditLanguagesScreen]: undefined;
  [RootScreens.EditProfileScreen]: undefined;
  [RootScreens.AddPostScreen]: undefined;
  [RootScreens.AddBookingScreen]: undefined;
  [RootScreens.ProfileScreen]: undefined;
};

export type RootStackScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

export type RootNavigationProp = NativeStackNavigationProp<RootStackParamList>;

export type BottomBarScreenProps<T extends keyof BottomBarStackParamList> = CompositeScreenProps<
  BottomTabScreenProps<BottomBarStackParamList, T>,
  RootStackScreenProps<keyof RootStackParamList>
>;
