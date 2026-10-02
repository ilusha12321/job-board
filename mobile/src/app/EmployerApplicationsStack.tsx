import { createNativeStackNavigator } from "@react-navigation/native-stack";
import EmployerApplicationsScreen from "../screens/EmployerApplicationsScreen";
import { useTheme } from "./ThemeContext";

export type EmployerApplicationsStackParamList = {
  EmployerApplications: undefined;
};

const Stack = createNativeStackNavigator<EmployerApplicationsStackParamList>();

export default function EmployerApplicationsStack() {
  const { isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: isDark ? "#0f172a" : "#ffffff" },
        headerTintColor: isDark ? "#ffffff" : "#0f172a",
      }}
    >
      <Stack.Screen
        name="EmployerApplications"
        component={EmployerApplicationsScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
}
