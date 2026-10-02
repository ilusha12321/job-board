import { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { getMyVacancies, deleteVacancy } from "../services/vacancyApi";
import type { MyVacancy } from "../types/vacancy";
import type { MyVacanciesStackParamList } from "../app/MyVacanciesStack";
import { getErrorMessage } from "../services/apiClient";
import { getTypeLabelKey } from "../i18n/vacancyTypes";
import AppHeader from "../components/AppHeader";

type Status = "loading" | "error" | "ready";

export default function MyVacanciesScreen() {
  const [vacancies, setVacancies] = useState<MyVacancy[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<MyVacanciesStackParamList>>();
  const { t } = useTranslation();

  const loadData = useCallback(() => {
    getMyVacancies()
      .then((result) => {
        setVacancies(result);
        setStatus("ready");
      })
      .catch((error) => {
        console.error(error);
        setStatus("error");
      });
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData]),
  );

  function handleDelete(vacancy: MyVacancy) {
    const warning =
      vacancy.applicationsCount > 0
        ? t("myVacancies.deleteMessageWithApps", {
            title: vacancy.title,
            count: vacancy.applicationsCount,
          })
        : t("myVacancies.deleteMessage", { title: vacancy.title });

    Alert.alert(t("myVacancies.deleteTitle"), warning, [
      { text: t("myVacancies.cancel"), style: "cancel" },
      {
        text: t("myVacancies.delete"),
        style: "destructive",
        onPress: async () => {
          setDeletingId(vacancy.id);
          try {
            await deleteVacancy(vacancy.id);
            setVacancies((current) =>
              current.filter((v) => v.id !== vacancy.id),
            );
          } catch (e) {
            Alert.alert(
              t("myVacancies.error"),
              getErrorMessage(e, t("myVacancies.deleteFailed")),
            );
          } finally {
            setDeletingId(null);
          }
        },
      },
    ]);
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
            {t("myVacancies.failedToLoad")}
          </Text>
          <Text className="mt-1 text-sm text-muted dark:text-slate-400">
            {t("myVacancies.tryAgain")}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-slate-950" edges={["top"]}>
      <AppHeader />
      <FlatList
        data={vacancies}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListHeaderComponent={
          <View className="mb-2 flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-text dark:text-white">
                {t("myVacancies.title")}
              </Text>
              <Text className="mt-1 text-sm text-muted dark:text-slate-400">
                {t("myVacancies.subtitle")}
              </Text>
            </View>
            <Pressable
              onPress={() => navigation.navigate("CreateVacancy")}
              className="rounded-md bg-primary px-3 py-2"
            >
              <Text className="text-sm font-medium text-white">
                {t("myVacancies.create")}
              </Text>
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          <View className="items-center border-t border-border py-10 dark:border-slate-700">
            <Text className="text-base font-semibold text-text dark:text-white">
              {t("myVacancies.empty")}
            </Text>
            <Text className="mt-1 text-sm text-muted dark:text-slate-400">
              {t("myVacancies.emptyHint")}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="rounded-xl border border-border bg-surface p-5 dark:border-slate-700 dark:bg-slate-800">
            <Text className="text-lg font-semibold text-text dark:text-white">
              {item.title}
            </Text>
            <Text className="mt-1 text-sm text-muted dark:text-slate-400">
              {item.location} · {t(getTypeLabelKey(item.type))}
            </Text>
            <Text className="mt-1 text-sm text-muted dark:text-slate-400">
              {item.salary ? item.salary : t("myVacancies.salaryNotSpecified")}
            </Text>

            <View className="mt-3 flex-row flex-wrap items-center gap-2">
              <View className="rounded-full bg-slate-100 px-2.5 py-0.5 dark:bg-slate-700">
                <Text className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  {t("myVacancies.application", {
                    count: item.applicationsCount,
                  })}
                </Text>
              </View>
              {item.newCount > 0 && (
                <View className="rounded-full bg-blue-50 px-2.5 py-0.5 dark:bg-blue-950">
                  <Text className="text-xs font-medium text-primary dark:text-blue-400">
                    {t("myVacancies.new", { count: item.newCount })}
                  </Text>
                </View>
              )}
            </View>

            <View className="mt-4 flex-row flex-wrap gap-4 border-t border-border pt-4 dark:border-slate-700">
              <Pressable
                onPress={() =>
                  navigation.navigate("EditVacancy", { id: item.id })
                }
              >
                <Text className="text-sm font-medium text-muted dark:text-slate-400">
                  {t("myVacancies.edit")}
                </Text>
              </Pressable>
              <Pressable
                onPress={() => handleDelete(item)}
                disabled={deletingId === item.id}
              >
                <Text className="text-sm font-medium text-danger">
                  {deletingId === item.id
                    ? t("myVacancies.deleting")
                    : t("myVacancies.delete")}
                </Text>
              </Pressable>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-3" />}
      />
    </SafeAreaView>
  );
}
