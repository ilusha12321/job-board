import { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import {
  useNavigation,
  useRoute,
  type RouteProp,
} from "@react-navigation/native";
import { getVacancyById, updateVacancy } from "../services/vacancyApi";
import { getErrorMessage } from "../services/apiClient";
import { type Vacancy } from "../types/vacancy";
import VacancyForm from "../components/VacancyForm";

type EditVacancyRouteParams = { EditVacancy: { id: string } };

export default function EditVacancyScreen() {
  const route = useRoute<RouteProp<EditVacancyRouteParams, "EditVacancy">>();
  const { id } = route.params;
  const [data, setData] = useState<Vacancy | null>(null);
  const [status, setStatus] = useState<"loading" | "error" | "ready">(
    "loading",
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation = useNavigation();
  useEffect(() => {
    let cancelled = false;

    getVacancyById(id)
      .then((result) => {
        if (!cancelled) {
          setData(result);
          setStatus("ready");
        }
      })
      .catch((e) => {
        console.error(e);
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  async function handleSubmit(updated: Omit<Vacancy, "id" | "createdBy">) {
    setError(null);
    setIsSubmitting(true);
    try {
      await updateVacancy(id, updated);
      navigation.goBack();
    } catch (e) {
      setError(getErrorMessage(e, "Unable to update job"));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (status === "loading") {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <ActivityIndicator />
      </View>
    );
  }

  if (status === "error" || !data) {
    return (
      <View className="flex-1 items-center justify-center bg-bg">
        <Text className="text-muted">Failed to load vacancy.</Text>
      </View>
    );
  }

  return (
    <VacancyForm
      onSubmit={handleSubmit}
      submitLabel="Update"
      error={error}
      isSubmitting={isSubmitting}
      initialData={data}
    />
  );
}
