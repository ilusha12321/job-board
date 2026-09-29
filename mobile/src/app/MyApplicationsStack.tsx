import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyApplicationsScreen from "../screens/MyApplicationsScreen";
import VacancyDetailsScreen from "../screens/VacancyDetailsScreen";
import type { VacanciesStackParamList } from "./VacanciesStack";

export type MyApplicationsStackParamList = {
  MyApplications: undefined;
  VacancyDetails: VacanciesStackParamList["VacancyDetails"];
};

const Stack = createNativeStackNavigator<MyApplicationsStackParamList>();

export default function MyApplicationsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="MyApplications"
        component={MyApplicationsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="VacancyDetails"
        component={VacancyDetailsScreen}
        options={{ title: "Vacancy" }}
      />
    </Stack.Navigator>
  );
}
