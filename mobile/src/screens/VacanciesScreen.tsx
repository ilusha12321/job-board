import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getVacancies } from "../services/vacancyApi";
import { type Vacancy } from "../types/vacancy";
import VacancyCard from "../components/VacancyCard";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import type { VacanciesStackParamList } from "../app/VacanciesStack";
import { useAuth } from "../app/AuthContext";

export default function VacanciesScreen() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading",
  );
  const navigation =
    useNavigation<NativeStackNavigationProp<VacanciesStackParamList>>();
  const { user, logout } = useAuth();
  useEffect(() => {
    let cancelled = false;

    getVacancies()
      .then((result) => {
        if (cancelled) return;
        setVacancies(result);
        setStatus("success");
      })
      .catch((error) => {
        console.error(error);
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (status === "loading") {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator />
      </View>
    );
  }

  if (status === "error") {
    return (
      <View className="flex-1 items-center justify-center bg-bg px-4">
        <Text className="text-base font-semibold text-text">
          Failed to load vacancies
        </Text>
        <Text className="mt-1 text-sm text-muted">Please try again later.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <FlatList
        data={vacancies}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListHeaderComponent={
          <View className="mb-2">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-2xl font-bold text-text">Vacancies</Text>
                <Text className="mt-1 text-sm text-muted">
                  {vacancies.length}{" "}
                  {vacancies.length === 1 ? "vacancy" : "vacancies"}
                </Text>
              </View>
              <Pressable
                onPress={logout}
                className="rounded-md border border-border bg-surface px-3 py-2"
              >
                <Text className="text-sm font-medium text-text">Logout</Text>
              </Pressable>
            </View>
            {user && (
              <Text className="mt-2 text-xs text-muted">
                Signed in as {user.username} ({user.role})
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <VacancyCard
            vacancy={item}
            onPress={() =>
              navigation.navigate("VacancyDetails", { id: item.id })
            }
          />
        )}
        ItemSeparatorComponent={() => <View className="h-3" />}
      />
    </SafeAreaView>
  );
}
