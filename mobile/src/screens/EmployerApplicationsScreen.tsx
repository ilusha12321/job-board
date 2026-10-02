import { useCallback, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import {
  getEmployerApplications,
  updateApplicationStatus,
  downloadResume,
} from "../services/applicationApi";
import { API_URL } from "../services/apiClient";
import type { EmployerApplication } from "../types/application";
import AppHeader from "../components/AppHeader";
import { useTranslation } from "react-i18next";

type StatusFilter = "all" | "delivered" | "reviewed" | "invite for interview";

const STATUS_OPTIONS: {
  value: EmployerApplication["status"];
  labelKey: string;
}[] = [
  { value: "delivered", labelKey: "employerApplications.filterDelivered" },
  { value: "reviewed", labelKey: "employerApplications.filterReviewed" },
  {
    value: "invite for interview",
    labelKey: "employerApplications.filterInterview",
  },
];

export default function EmployerApplicationsScreen() {
  const [applications, setApplications] = useState<EmployerApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { t, i18n } = useTranslation();

  useFocusEffect(
    useCallback(() => {
      let cancelled = false;
      getEmployerApplications()
        .then((result) => {
          if (!cancelled) setApplications(result);
        })
        .catch((error) => console.error(error))
        .finally(() => {
          if (!cancelled) setIsLoading(false);
        });
      return () => {
        cancelled = true;
      };
    }, []),
  );

  const filtered = applications.filter(
    (app) => statusFilter === "all" || app.status === statusFilter,
  );
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  async function handleDownload(item: EmployerApplication) {
    if (!item.resumeName || downloadingId) return;
    setDownloadingId(item.id);
    try {
      await downloadResume(item.id, item.resumeName);
    } catch (error) {
      console.error(error);
      Alert.alert(
        t("employerApplications.error"),
        t("employerApplications.downloadError"),
      );
    } finally {
      setDownloadingId(null);
    }
  }
  async function handleStatusChange(
    applicationId: string,
    status: EmployerApplication["status"],
  ) {
    setUpdatingId(applicationId);
    try {
      const updated = await updateApplicationStatus(applicationId, status);
      setApplications((current) =>
        current.map((app) => (app.id === updated.id ? updated : app)),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingId(null);
    }
  }
  const countFor = (f: StatusFilter) =>
    f === "all"
      ? applications.length
      : applications.filter((a) => a.status === f).length;

  if (isLoading) {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-bg dark:bg-slate-950"
        edges={["top"]}
      >
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg dark:bg-slate-950" edges={["top"]}>
      <View className="px-4 pt-4">
        <Text className="text-2xl font-bold text-text dark:text-white">
          {t("employerApplications.title")}
        </Text>
        <Text className="mt-1 text-sm text-muted dark:text-slate-400">
          {t("employerApplications.subtitle")}
        </Text>
      </View>
      <View className="px-4 pb-3">
        <View className="flex-row flex-wrap gap-2">
          {(
            [
              { value: "all", labelKey: "employerApplications.filterAll" },
              {
                value: "delivered",
                labelKey: "employerApplications.filterDelivered",
              },
              {
                value: "reviewed",
                labelKey: "employerApplications.filterReviewed",
              },
              {
                value: "invite for interview",
                labelKey: "employerApplications.filterInterview",
              },
            ] as { value: StatusFilter; labelKey: string }[]
          ).map((f) => (
            <Pressable
              key={f.value}
              onPress={() => setStatusFilter(f.value)}
              className={`rounded-lg border px-3 py-2 ${
                statusFilter === f.value
                  ? "border-primary bg-blue-50 dark:border-blue-400 dark:bg-blue-950"
                  : "border-border dark:border-slate-700"
              }`}
            >
              <Text
                className={
                  statusFilter === f.value
                    ? "font-medium text-primary dark:text-blue-400"
                    : "text-text dark:text-white"
                }
              >
                {t(f.labelKey)} ({countFor(f.value)})
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingTop: 0, gap: 12 }}
        ListEmptyComponent={
          <View className="items-center border-t border-border py-10 dark:border-slate-700">
            <Text className="text-base font-semibold text-text dark:text-white">
              {t("employerApplications.emptyTitle")}
            </Text>
            <Text className="mt-1 text-sm text-muted dark:text-slate-400">
              {applications.length === 0
                ? t("employerApplications.emptyNoneYet")
                : t("employerApplications.emptyNoMatch")}
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="rounded-xl border border-border bg-surface p-5 dark:border-slate-700 dark:bg-slate-800">
            <Text className="text-xs font-medium uppercase tracking-wide text-muted dark:text-slate-400">
              {t("employerApplications.vacancyLabel")}
            </Text>
            <Text className="text-base font-semibold text-text dark:text-white">
              {item.vacancyTitle}
            </Text>

            <View className="mt-3 flex-row gap-6">
              <View className="flex-1">
                <Text className="text-xs font-medium uppercase tracking-wide text-muted dark:text-slate-400">
                  {t("employerApplications.applicantLabel")}
                </Text>
                <Text className="mt-0.5 text-sm font-medium text-text dark:text-white">
                  {item.applicantUsername}
                </Text>
                <Text className="text-sm text-muted dark:text-slate-400">
                  {item.applicantEmail}
                </Text>
              </View>
              <View>
                <Text className="text-xs font-medium uppercase tracking-wide text-muted dark:text-slate-400">
                  {t("employerApplications.appliedLabel")}
                </Text>
                <Text className="mt-0.5 text-sm text-text dark:text-white">
                  {new Date(item.appliedAt).toLocaleDateString(
                    i18n.language === "uk" ? "uk-UA" : "en-GB",
                  )}
                </Text>
              </View>
            </View>

            <View className="mt-4 flex-row flex-wrap gap-2 border-t border-border pt-4 dark:border-slate-700">
              {STATUS_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => handleStatusChange(item.id, opt.value)}
                  disabled={updatingId === item.id}
                  className={`rounded-lg border px-3 py-2 ${
                    item.status === opt.value
                      ? "border-primary bg-blue-50 dark:border-blue-400 dark:bg-blue-950"
                      : "border-border dark:border-slate-700"
                  }`}
                >
                  <Text
                    className={
                      item.status === opt.value
                        ? "font-medium text-primary dark:text-blue-400"
                        : "text-text dark:text-white"
                    }
                  >
                    {t(opt.labelKey)}
                  </Text>
                </Pressable>
              ))}
            </View>

            <View className="mt-3">
              {item.resumeName ? (
                <Pressable
                  onPress={() => handleDownload(item)}
                  disabled={downloadingId === item.id}
                >
                  <Text className="text-sm font-medium text-primary dark:text-blue-400">
                    {downloadingId === item.id
                      ? t("employerApplications.downloading")
                      : t("employerApplications.downloadResume")}{" "}
                    <Text className="font-normal text-muted dark:text-slate-400">
                      ({item.resumeName})
                    </Text>
                  </Text>
                </Pressable>
              ) : (
                <Text className="text-sm text-muted dark:text-slate-400">
                  {t("employerApplications.noResume")}
                </Text>
              )}
            </View>
          </View>
        )}
        ItemSeparatorComponent={() => <View className="h-3" />}
      />
    </SafeAreaView>
  );
}
