import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVacanciesById, updateVacancy } from "../services/vacancyApi";
import { type Vacancy } from "../types/vacancy";
import VacancyForm from "../components/VacancyForm";
import { useAuth } from "../app/AuthContext";

type PageStatus = "loading" | "not-found" | "forbidden" | "ready";

export default function EditVacancyPage() {
  const [data, setData] = useState<Vacancy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<PageStatus>("loading");

  const { user } = useAuth();

  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    const editData = async () => {
      if (!id) {
        setStatus("not-found");
        return;
      }
      const result = await getVacanciesById(id);
      if (!result) {
        setStatus("not-found");
        return;
      }
      if (user?.id !== result.createdBy) {
        setStatus("forbidden");
      } else {
        setData(result);
        setStatus("ready");
      }
    };
    editData();
  }, [id, user]);

  const navigate = useNavigate();

  async function handleSubmit(editVacancy: Omit<Vacancy, "id" | "createdBy">) {
    setError(null);
    if (!id || !data) {
      return;
    }

    const vacancyToUpdate = { ...editVacancy, createdBy: data.createdBy };
    const editInfo = await updateVacancy(id, vacancyToUpdate);
    if (!editInfo) {
      setError("Unable to update job");
      return;
    }
    navigate(`/vacancies/${id}`);
  }
  return (
    <>
      {status === "loading" && "Loading..."}

      {status === "not-found" && "Vacancy not found."}

      {status === "forbidden" &&
        "You don't have permission to edit this vacancy."}

      {status === "ready" && data && (
        <VacancyForm
          onSubmit={handleSubmit}
          submitLabel="Update"
          error={error}
          initialData={data}
        />
      )}
    </>
  );
}
