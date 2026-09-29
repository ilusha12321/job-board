import { useEffect, useState } from "react";
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
import { useCallback } from "react";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { getMyVacancies, deleteVacancy } from "../services/vacancyApi";
import type { MyVacancy } from "../types/vacancy";
import type { MyVacanciesStackParamList } from "../app/MyVacanciesStack";
import { getErrorMessage } from "../services/apiClient";

type Status = "loading" | "error" | "ready";

export default function MyVacanciesScreen() {
  const [vacancies, setVacancies] = useState<MyVacancy[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const navigation =
    useNavigation<NativeStackNavigationProp<MyVacanciesStackParamList>>();

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
        ? `Delete "${vacancy.title}"? ${vacancy.applicationsCount} application(s) will be deleted too.`
        : `Delete "${vacancy.title}"?`;

    Alert.alert("Delete vacancy", warning, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
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
              "Error",
              getErrorMessage(e, "Unable to delete vacancy"),
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
      <SafeAreaView
        className="flex-1 items-center justify-center bg-bg"
        edges={["top"]}
      >
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (status === "error") {
    return (
      <SafeAreaView
        className="flex-1 items-center justify-center bg-bg px-4"
        edges={["top"]}
      >
        <Text className="text-base font-semibold text-text">
          Failed to load vacancies
        </Text>
        <Text className="mt-1 text-sm text-muted">Please try again later.</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-bg" edges={["top"]}>
      <FlatList
        data={vacancies}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, gap: 12 }}
        ListHeaderComponent={
          <View className="mb-2 flex-row items-center justify-between">
            <View>
              <Text className="text-2xl font-bold text-text">My vacancies</Text>
              <Text className="mt-1 text-sm text-muted">
                Vacancies you have published.
              </Text>
            </View>
            <Pressable
              onPress={() => navigation.navigate("CreateVacancy")}
              className="rounded-md bg-primary px-3 py-2"
            >
              <Text className="text-sm font-medium text-white">Create</Text>
            </Pressable>
          </View>
        }
        ListEmptyComponent={
          <View className="items-center border-t border-border py-10">
            <Text className="text-base font-semibold text-text">
              No vacancies yet
            </Text>
            <Text className="mt-1 text-sm text-muted">
              Create your first vacancy to start receiving applications.
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <View className="rounded-xl border border-border bg-surface p-5">
            <Text className="text-lg font-semibold text-text">
              {item.title}
            </Text>
            <Text className="mt-1 text-sm text-muted">
              {item.location} · {item.type}
            </Text>
            <Text className="mt-1 text-sm text-muted">
              {item.salary ? item.salary : "Salary not specified"}
            </Text>

            <View className="mt-3 flex-row flex-wrap items-center gap-2">
              <View className="rounded-full bg-slate-100 px-2.5 py-0.5">
                <Text className="text-xs font-medium text-slate-700">
                  {item.applicationsCount}{" "}
                  {item.applicationsCount === 1
                    ? "application"
                    : "applications"}
                </Text>
              </View>
              {item.newCount > 0 && (
                <View className="rounded-full bg-blue-50 px-2.5 py-0.5">
                  <Text className="text-xs font-medium text-primary">
                    {item.newCount} new
                  </Text>
                </View>
              )}
            </View>

            <View className="mt-4 flex-row flex-wrap gap-4 border-t border-border pt-4">
              <Pressable
                onPress={() =>
                  navigation.navigate("EditVacancy", { id: item.id })
                }
              >
                <Text className="text-sm font-medium text-muted">Edit</Text>
              </Pressable>
              <Pressable
                onPress={() => handleDelete(item)}
                disabled={deletingId === item.id}
              >
                <Text className="text-sm font-medium text-danger">
                  {deletingId === item.id ? "Deleting..." : "Delete"}
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
