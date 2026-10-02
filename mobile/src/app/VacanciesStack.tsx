import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import VacanciesScreen from "../screens/VacanciesScreen";
import VacancyDetailsScreen from "../screens/VacancyDetailsScreen";
import EditVacancyScreen from "../screens/EditVacancyScreen";
import { useTheme } from "./ThemeContext";

export type VacanciesStackParamList = {
  Vacancies: undefined;
  VacancyDetails: { id: string };
  EditVacancy: { id: string };
};

const Stack = createNativeStackNavigator<VacanciesStackParamList>();

export default function VacanciesStack() {
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
        name="Vacancies"
        component={VacanciesScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VacancyDetails"
        component={VacancyDetailsScreen}
        options={{ title: t("navHeaders.vacancy") }}
      />
      <Stack.Screen
        name="EditVacancy"
        component={EditVacancyScreen}
        options={{ title: t("navHeaders.editVacancy") }}
      />
    </Stack.Navigator>
  );
}
