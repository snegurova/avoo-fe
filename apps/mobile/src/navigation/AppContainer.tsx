import { RootStackParamList } from "../types/navigation";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import BottomBarNavigator from "./BottomBarNavigator";
import { useAuthStore } from "@avoo/store";
import RegisterScreen from "../screens/RegisterScreen";



const Stack = createNativeStackNavigator<RootStackParamList>();

const AppContainer = () => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);


  return (
    <Stack.Navigator
      initialRouteName={isAuthenticated ? "BottomBar" : "LoginScreen"}
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        <>
          <Stack.Screen name="LoginScreen" component={LoginScreen} />
          <Stack.Screen name="RegisterScreen" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="BottomBar" component={BottomBarNavigator} />
        </>
      )}
    </Stack.Navigator>
  );
};

export default AppContainer;
