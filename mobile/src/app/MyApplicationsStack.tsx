import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import MyApplicationsScreen from "../screens/MyApplicationsScreen";
import VacancyDetailsScreen from "../screens/VacancyDetailsScreen";
import type { VacanciesStackParamList } from "./VacanciesStack";
import { useTheme } from "./ThemeContext";

export type MyApplicationsStackParamList = {
  MyApplications: undefined;
  VacancyDetails: VacanciesStackParamList["VacancyDetails"];
};

const Stack = createNativeStackNavigator<MyApplicationsStackParamList>();

export default function MyApplicationsStack() {
  const { isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: isDark ? "#0f172a" : "#ffffff" },
        headerTintColor: isDark ? "#ffffff" : "#0f172a",
      }}
    >
      <Stack.Screen
        name="MyApplications"
        component={MyApplicationsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VacancyDetails"
        component={VacancyDetailsScreen}
        options={{ title: t("navHeaders.vacancy") }}
      />
    </Stack.Navigator>
  );
}
