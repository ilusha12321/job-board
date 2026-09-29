import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MyVacanciesScreen from "../screens/MyVacanciesScreen";
import CreateVacancyScreen from "../screens/CreateVacancyScreen";
import EditVacancyScreen from "../screens/EditVacancyScreen";

export type MyVacanciesStackParamList = {
  MyVacancies: undefined;
  CreateVacancy: undefined;
  EditVacancy: { id: string };
};

const Stack = createNativeStackNavigator<MyVacanciesStackParamList>();

export default function MyVacanciesStack() {
  return (
    <Stack.Navigator>
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
