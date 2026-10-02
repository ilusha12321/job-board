import { useCallback, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation, useFocusEffect } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getVacancies } from "../services/vacancyApi";
import { getMyApplications } from "../services/applicationApi";
import type { Vacancy } from "../types/vacancy";
import type { Application } from "../types/application";
import type { MyApplicationsStackParamList } from "../app/MyApplicationsStack";
import VacancyCard from "../components/VacancyCard";
import AppHeader from "../components/AppHeader";

type Item = {
  vacancy: Vacancy;
  status: Application["status"];
  appliedAt: string;
};

const STATUS_STYLES: Record<
  Application["status"],
  { label: string; bg: string; text: string }
> = {
  delivered: {
    label: "Delivered",
    bg: "bg-slate-100 dark:bg-slate-800",
    text: "text-slate-700 dark:text-slate-300",
  },
  reviewed: {
    label: "Reviewed",
    bg: "bg-amber-50 dark:bg-amber-950",
    text: "text-amber-700 dark:text-amber-400",
  },
  "invite for interview": {
    label: "Interview invitation",
    bg: "bg-green-50 dark:bg-green-950",
    text: "text-green-700 dark:text-green-400",
  },
};

export default function MyApplicationsScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation =
    useNavigation<NativeStackNavigationProp<MyApplicationsStackParamList>>();

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      setIsLoading(true);

      const loadData = async () => {
        try {
          const [applications, vacancies] = await Promise.all([
            getMyApplications(),
            getVacancies(),
          ]);
          if (cancelled) return;

          const byId = new Map(vacancies.map((v) => [v.id, v]));
          setItems(
            applications.flatMap((app) => {
              const vacancy = byId.get(app.vacancyId);
              return vacancy
                ? [{ vacancy, status: app.status, appliedAt: app.appliedAt }]
                : [];
            }),
          );
        } catch (error) {
          console.error(error);
          if (!cancelled) setItems([]);
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      };

      loadData();
      return () => {
        cancelled = true;
      };
    }, []),
  );

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-bg dark:bg-slate-950" edges={["top"]}>
        <AppHeader />
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-slate-950" edges={["top"]}>
      <AppHeader />
      <FlatList
        data={items}
        keyExtractor={(item) => item.vacancy.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListHeaderComponent={
          <View className="mb-2">
            <Text className="text-2xl font-bold text-text dark:text-white">
              My applications
            </Text>
            <Text className="mt-1 text-sm text-muted dark:text-slate-400">
              Vacancies you have applied to.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View className="items-center border-t border-border py-10 dark:border-slate-700">
            <Text className="text-base font-semibold text-text dark:text-white">
              No applications yet
            </Text>
            <Text className="mt-1 text-sm text-muted dark:text-slate-400">
              Find a vacancy that interests you and submit your application.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="gap-2">
            <VacancyCard
              vacancy={item.vacancy}
              onPress={() =>
                navigation.navigate("VacancyDetails", { id: item.vacancy.id })
              }
            />
            <View className="flex-row flex-wrap items-center gap-3 px-1">
              <View
                className={`rounded-full px-2.5 py-0.5 ${STATUS_STYLES[item.status].bg}`}
              >
                <Text
                  className={`text-xs font-medium ${STATUS_STYLES[item.status].text}`}
                >
                  {STATUS_STYLES[item.status].label}
                </Text>
              </View>
              <Text className="text-sm text-muted dark:text-slate-400">
                Applied {new Date(item.appliedAt).toLocaleDateString("en-GB")}
              </Text>
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-3" />}
      />
    </SafeAreaView>
  );
}
