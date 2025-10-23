import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  LoginScreen: undefined;
  BottomBar: NavigatorScreenParams<BottomBarStackParamList>;
};

export type ProfileStackParamList = {
  Settings: undefined;
  ExampleScreensParams: { id: number } | undefined;
};

export type BottomBarStackParamList = {
  Home: undefined;
  Profile: NavigatorScreenParams<ProfileStackParamList>;
};