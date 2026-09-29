import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { createVacancy } from "../services/vacancyApi";
import { getErrorMessage } from "../services/apiClient";
import { type Vacancy } from "../types/vacancy";
import VacancyForm from "../components/VacancyForm";
import type { MyVacanciesStackParamList } from "../app/MyVacanciesStack";

export default function CreateVacancyScreen() {
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigation =
    useNavigation<NativeStackNavigationProp<MyVacanciesStackParamList>>();

  async function handleSubmit(data: Omit<Vacancy, "id" | "createdBy">) {
    setError(null);
    setIsSubmitting(true);
    try {
      await createVacancy(data);
      navigation.goBack();
    } catch (e) {
      setError(getErrorMessage(e, "Unable to create job"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <VacancyForm
      onSubmit={handleSubmit}
      submitLabel="Create"
      error={error}
      isSubmitting={isSubmitting}
    />
  );
}
