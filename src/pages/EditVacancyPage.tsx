import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVacancyById, updateVacancy } from "../services/vacancyApi";
import { ApiError, getErrorMessage } from "../services/apiClient";
import { type Vacancy } from "../types/vacancy";
import VacancyForm from "../components/VacancyForm";
import { useAuth } from "../app/AuthContext";

type PageStatus = "loading" | "not-found" | "forbidden" | "error" | "ready";

export default function EditVacancyPage() {
  const [data, setData] = useState<Vacancy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<PageStatus>("loading");

  const { user } = useAuth();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      setStatus("not-found");
      return;
    }
    let cancelled = false;

    const loadData = async () => {
      try {
        const result = await getVacancyById(id);
        if (cancelled) return;
        if (user?.id !== result.createdBy) {
          setStatus("forbidden");
        } else {
          setData(result);
          setStatus("ready");
        }
      } catch (e) {
        if (cancelled) return;
        setStatus(
          e instanceof ApiError && e.status === 404 ? "not-found" : "error",
        );
      }
    };

    loadData();
    return () => {
      cancelled = true;
    };
  }, [id, user]);

  async function handleSubmit(editVacancy: Omit<Vacancy, "id" | "createdBy">) {
    setError(null);
    if (!id || !data) return;

    try {
      await updateVacancy(id, { ...editVacancy, createdBy: data.createdBy });
      navigate(`/vacancies/${id}`);
    } catch (e) {
      setError(getErrorMessage(e, "Unable to update job"));
    }
  }

  return (
    <>
      {status === "loading" && "Loading..."}
      {status === "not-found" && "Vacancy not found."}
      {status === "forbidden" &&
        "You don't have permission to edit this vacancy."}
      {status === "error" && "Failed to load vacancy. Please try again later."}

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
