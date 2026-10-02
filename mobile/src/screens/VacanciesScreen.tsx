import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TextInput,
  Pressable,
} from "react-native";
import { useTranslation } from "react-i18next";
import AppHeader from "../components/AppHeader";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getVacancies } from "../services/vacancyApi";
import { type Vacancy } from "../types/vacancy";
import type { VacanciesStackParamList } from "../app/VacanciesStack";
import VacancyCard from "../components/VacancyCard";
import { VACANCY_TYPES, TYPE_LABEL_KEYS } from "../i18n/vacancyTypes";

export default function VacanciesScreen() {
  const { t } = useTranslation();
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
            {t("vacancies.failedToLoad")}
          </Text>
          <Text className="mt-1 text-sm text-muted dark:text-slate-400">
            {t("vacancies.tryAgain")}
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
                {t("vacancies.title")}
              </Text>
              <Text className="mt-1 text-sm text-muted dark:text-slate-400">
                {t("vacancies.count", { count: filteredVacancies.length })}
                {hasFilters &&
                  ` ${t("vacancies.ofTotal", { total: vacancies.length })}`}
              </Text>
            </View>

            <View className="gap-2">
              <TextInput
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder={t("vacancies.searchPlaceholder")}
                placeholderTextColor="#94a3b8"
                className="rounded-lg border border-border bg-surface px-3 py-2.5 text-sm text-text dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
              <TextInput
                value={locationTerm}
                onChangeText={setLocationTerm}
                placeholder={t("vacancies.locationPlaceholder")}
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
                    {t("vacancies.allTypes")}
                  </Text>
                </Pressable>
                {VACANCY_TYPES.map((type) => (
                  <Pressable
                    key={type}
                    onPress={() => setSelectedType(type)}
                    className={`rounded-lg border px-3 py-2 ${
                      selectedType === type
                        ? "border-primary bg-blue-50 dark:border-blue-400 dark:bg-blue-950"
                        : "border-border dark:border-slate-700"
                    }`}
                  >
                    <Text
                      className={
                        selectedType === type
                          ? "font-medium text-primary dark:text-blue-400"
                          : "text-text dark:text-white"
                      }
                    >
                      {t(TYPE_LABEL_KEYS[type])}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {hasFilters && (
                <Pressable onPress={clearFilters} className="self-start">
                  <Text className="text-sm font-medium text-primary dark:text-blue-400">
                    {t("vacancies.clearFilters")}
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        }
        ListEmptyComponent={
          <View className="items-center border-t border-border py-10 dark:border-slate-700">
            <Text className="text-base font-semibold text-text dark:text-white">
              {t("vacancies.notFound")}
            </Text>
            <Text className="mt-1 text-sm text-muted dark:text-slate-400">
              {t("vacancies.tryChanging")}
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
