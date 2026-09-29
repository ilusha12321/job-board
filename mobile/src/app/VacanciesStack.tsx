import { createNativeStackNavigator } from "@react-navigation/native-stack";
import VacanciesScreen from "../screens/VacanciesScreen";
import VacancyDetailsScreen from "../screens/VacancyDetailsScreen";

export type VacanciesStackParamList = {
  Vacancies: undefined;
  VacancyDetails: { id: string };
};

const Stack = createNativeStackNavigator<VacanciesStackParamList>();

export default function VacanciesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Vacancies"
        component={VacanciesScreen}
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
