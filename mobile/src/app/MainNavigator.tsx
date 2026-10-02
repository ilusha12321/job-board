import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useTranslation } from "react-i18next";
import VacanciesStack from "./VacanciesStack";
import MyApplicationsStack from "./MyApplicationsStack";
import MyVacanciesStack from "./MyVacanciesStack";
import EmployerApplicationsStack from "./EmployerApplicationsStack";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeContext";

export type MainStackParamList = {
  VacanciesTab: undefined;
  MyApplicationsTab: undefined;
  MyVacanciesTab: undefined;
  EmployerApplicationsTab: undefined;
};

const Tab = createBottomTabNavigator<MainStackParamList>();

export default function MainNavigator() {
  const { user } = useAuth();
  const { isDark } = useTheme();
  const { t } = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: isDark ? "#0f172a" : "#ffffff" },
        tabBarActiveTintColor: "#2563eb",
        tabBarInactiveTintColor: isDark ? "#94a3b8" : "#64748b",
      }}
    >
      <Tab.Screen
        name="VacanciesTab"
        component={VacanciesStack}
        options={{ title: t("vacancies.title") }}
      />
      {user?.role === "jobseeker" && (
        <Tab.Screen
          name="MyApplicationsTab"
          component={MyApplicationsStack}
          options={{ title: t("myApplications.title") }}
        />
      )}
      {user?.role === "employer" && (
        <>
          <Tab.Screen
            name="MyVacanciesTab"
            component={MyVacanciesStack}
            options={{ title: t("myVacancies.title") }}
          />
          <Tab.Screen
            name="EmployerApplicationsTab"
            component={EmployerApplicationsStack}
            options={{ title: t("employerApplications.title") }}
          />
        </>
      )}
    </Tab.Navigator>
  );
}
