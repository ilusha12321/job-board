import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyVacanciesScreen from "../screens/MyVacanciesScreen";
import CreateVacancyScreen from "../screens/CreateVacancyScreen";
import EditVacancyScreen from "../screens/EditVacancyScreen";
import { useTheme } from "./ThemeContext";

export type MyVacanciesStackParamList = {
  MyVacancies: undefined;
  CreateVacancy: undefined;
  EditVacancy: { id: string };
};

const Stack = createNativeStackNavigator<MyVacanciesStackParamList>();

export default function MyVacanciesStack() {
  const { isDark } = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: isDark ? "#0f172a" : "#ffffff" },
        headerTintColor: isDark ? "#ffffff" : "#0f172a",
        contentStyle: { backgroundColor: isDark ? "#020617" : "#f5f7fa" },
      }}
    >
      <Stack.Screen
        name="MyVacancies"
        component={MyVacanciesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="CreateVacancy"
        component={CreateVacancyScreen}
        options={{ title: "Create vacancy" }}
      />
      <Stack.Screen
        name="EditVacancy"
        component={EditVacancyScreen}
        options={{ title: "Edit vacancy" }}
      />
    </Stack.Navigator>
  );
}
