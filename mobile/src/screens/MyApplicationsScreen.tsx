import { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getVacancies } from "../services/vacancyApi";
import { getMyApplications } from "../services/applicationApi";
import type { Vacancy } from "../types/vacancy";
import type { Application } from "../types/application";
import type { MainStackParamList } from "../app/MainNavigator";
import VacancyCard from "../components/VacancyCard";

type Item = {
  vacancy: Vacancy;
  status: Application["status"];
  appliedAt: string;
};

const STATUS_STYLES: Record<
  Application["status"],
  { label: string; className: string }
> = {
  delivered: { label: "Delivered", className: "bg-slate-100 text-slate-700" },
  reviewed: { label: "Reviewed", className: "bg-amber-50 text-amber-700" },
  "invite for interview": {
    label: "Interview invitation",
    className: "bg-green-50 text-green-700",
  },
};

export default function MyApplicationsScreen() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigation =
    useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  useEffect(() => {
    let cancelled = false;

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
        setItems([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-bg"
        edges={["top"]}
      >
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.vacancy.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListHeaderComponent={
          <View className="mb-2">
            <Text className="text-2xl font-bold text-text">
              My applications
            </Text>
            <Text className="mt-1 text-sm text-muted">
              Vacancies you have applied to.
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View className="items-center border-t border-border py-10">
            <Text className="text-base font-semibold text-text">
              No applications yet
            </Text>
            <Text className="mt-1 text-sm text-muted">
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
                className={`rounded-full px-2.5 py-0.5 ${STATUS_STYLES[item.status].className}`}
              >
                <Text className="text-xs font-medium">
                  {STATUS_STYLES[item.status].label}
                </Text>
              </View>
              <Text className="text-sm text-muted">
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
