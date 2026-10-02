import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
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
        options={{ title: "Vacancies" }}
      />
      {user?.role === "jobseeker" && (
        <Tab.Screen
          name="MyApplicationsTab"
          component={MyApplicationsStack}
          options={{ title: "My applications" }}
        />
      )}
      {user?.role === "employer" && (
        <>
          <Tab.Screen
            name="MyVacanciesTab"
            component={MyVacanciesStack}
            options={{ title: "My vacancies" }}
          />
          <Tab.Screen
            name="EmployerApplicationsTab"
            component={EmployerApplicationsStack}
            options={{ title: "Applications" }}
          />
        </>
      )}
    </Tab.Navigator>
  );
}
