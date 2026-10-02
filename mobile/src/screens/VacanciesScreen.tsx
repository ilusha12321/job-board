import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  Pressable,
} from "react-native";
import AppHeader from "../components/AppHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getVacancies } from "../services/vacancyApi";
import { type Vacancy } from "../types/vacancy";
import type { VacanciesStackParamList } from "../app/VacanciesStack";
import VacancyCard from "../components/VacancyCard";

const VACANCY_TYPES = [
  "Full-Time",
  "Part-Time",
  "Contract",
  "Internship",
] as const;

export default function VacanciesScreen() {
  const [vacancies, setVacancies] = useState<Vacancy[]>([]);
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading",
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [locationTerm, setLocationTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("");
  const navigation =
    useNavigation<NativeStackNavigationProp<VacanciesStackParamList>>();

  useFocusEffect(
    useCallback(() => {
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
    }, []),
  );

  const filteredVacancies = vacancies.filter((vacancy) => {
    const matchesTitle = vacancy.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesLocation =
      locationTerm === "" ||
      vacancy.location.toLowerCase().includes(locationTerm.toLowerCase());
    const matchesType = selectedType === "" || vacancy.type === selectedType;
    return matchesTitle && matchesLocation && matchesType;
  });

  const hasFilters =
    searchTerm.trim() !== "" ||
    locationTerm.trim() !== "" ||
    selectedType !== "";

  function clearFilters() {
    setSearchTerm("");
    setLocationTerm("");
    setSelectedType("");
  }

  if (status === "loading") {
    return (
      <SafeAreaView className="flex-1 bg-bg dark:bg-slate-950" edges={["top"]}>
        <AppHeader />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  if (status === "error") {
    return (
      <SafeAreaView className="flex-1 bg-bg dark:bg-slate-950" edges={["top"]}>
        <AppHeader />
        <View className="flex-1 items-center justify-center px-4">
          <Text className="text-base font-semibold text-text dark:text-white">
            Failed to load vacancies
          </Text>
          <Text className="mt-1 text-sm text-muted dark:text-slate-400">
            Please try again later.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-slate-950" edges={["top"]}>
      <AppHeader />
      <FlatList
        data={filteredVacancies}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListHeaderComponent={
          <View className="mb-2 gap-4">
            <View>
              <Text className="text-2xl font-bold text-text dark:text-white">
                Vacancies
              </Text>
              <Text className="mt-1 text-sm text-muted dark:text-slate-400">
                {filteredVacancies.length}{" "}
                {filteredVacancies.length === 1 ? "vacancy" : "vacancies"}
                {hasFilters && ` of ${vacancies.length}`}
              </Text>
            </View>

            <View className="gap-2">
              <TextInput
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="Search by title"
                placeholderTextColor="#94a3b8"
                className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <TextInput
                value={locationTerm}
                onChangeText={setLocationTerm}
                placeholder="Location"
                placeholderTextColor="#94a3b8"
                className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />

              <View className="flex-row flex-wrap gap-2">
                <Pressable
                  onPress={() => setSelectedType("")}
                  className={`rounded-lg border px-3 py-2 ${
                    selectedType === ""
                      ? "border-primary bg-blue-50 dark:border-blue-400 dark:bg-blue-950"
                      : "border-border dark:border-slate-700"
                  }`}
                >
                  <Text
                    className={
                      selectedType === ""
                        ? "font-medium text-primary dark:text-blue-400"
                        : "text-text dark:text-white"
                    }
                  >
                    All types
                  </Text>
                </Pressable>
                {VACANCY_TYPES.map((t) => (
                  <Pressable
                    key={t}
                    onPress={() => setSelectedType(t)}
                    className={`rounded-lg border px-3 py-2 ${
                      selectedType === t
                        ? "border-primary bg-blue-50 dark:border-blue-400 dark:bg-blue-950"
                        : "border-border dark:border-slate-700"
                    }`}
                  >
                    <Text
                      className={
                        selectedType === t
                          ? "font-medium text-primary dark:text-blue-400"
                          : "text-text dark:text-white"
                      }
                    >
                      {t}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {hasFilters && (
                <Pressable onPress={clearFilters} className="self-start">
                  <Text className="text-sm font-medium text-primary dark:text-blue-400">
                    Clear filters
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View className="items-center border-t border-border py-10 dark:border-slate-700">
            <Text className="text-base font-semibold text-text dark:text-white">
              No vacancies found
            </Text>
            <Text className="mt-1 text-sm text-muted dark:text-slate-400">
              Try changing your search or filters.
            </Text>
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
