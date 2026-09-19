import { useState } from "react";
import { createVacancy } from "../services/vacancyApi";
import { getErrorMessage } from "../services/apiClient";
import { type Vacancy } from "../types/vacancy";
import { useNavigate } from "react-router-dom";
import VacancyForm from "../components/VacancyForm";
import { useAuth } from "../app/AuthContext";

export default function CreateVacancyPage() {
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  async function handleSubmit(
    vacancySubmission: Omit<Vacancy, "id" | "createdBy">,
  ) {
    if (!user) return;
    setError(null);
    try {
      await createVacancy({ ...vacancySubmission, createdBy: user.id });
      navigate("/vacancies");
    } catch (e) {
      setError(getErrorMessage(e, "Unable to create job"));
    }
  }

  return (
    <VacancyForm onSubmit={handleSubmit} submitLabel="Create" error={error} />
  );
}
