import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getVacanciesById, updateVacancy } from "../services/vacancyApi";
import { type Vacancy } from "../types/vacancy";
import VacancyForm from "../components/VacancyForm";
import { useAuth } from "../app/AuthContext";

export default function EditVacancyPage() {
  const [data, setData] = useState<Vacancy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const { id } = useParams<{ id: string }>();
  useEffect(() => {
    const editData = async () => {
      if (!id) {
        return;
      }
      const result = await getVacanciesById(id);
      if (!result) {
        return;
      }
      setData(result);
    };
    editData();
  }, [id]);

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
      {!data ? (
        "Loading..."
      ) : user?.id !== data.createdBy ? (
        "You don't have permission to edit this vacancy."
      ) : (
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
