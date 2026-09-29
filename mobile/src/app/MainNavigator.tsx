import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import VacanciesStack from "./VacanciesStack";
import MyApplicationsStack from "./MyApplicationsStack";
import MyVacanciesStack from "./MyVacanciesStack";
import { useAuth } from "./AuthContext";

export type MainStackParamList = {
  VacanciesTab: undefined;
  MyApplicationsTab: undefined;
  MyVacanciesTab: undefined;
};

const Tab = createBottomTabNavigator<MainStackParamList>();

export default function MainNavigator() {
  const { user } = useAuth();

  return (
    <Tab.Navigator screenOptions={{ headerShown: false }}>
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
        <Tab.Screen
          name="MyVacanciesTab"
          component={MyVacanciesStack}
          options={{ title: "My vacancies" }}
        />
      )}
    </Tab.Navigator>
  );
}
