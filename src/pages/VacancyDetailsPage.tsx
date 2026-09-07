import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getVacanciesById } from "../services/vacancyApi";
import { type Vacancy } from "../types/vacancy";
import VacancyCard from "../components/VacancyCard";
import { deleteVacancy } from "../services/vacancyApi";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../app/AuthContext";

const VacancyDetailsPage = () => {
  const [state, setState] = useState<Vacancy | null>(null);
  const { id } = useParams<{ id: string }>();

  const { user } = useAuth();

  const navigate = useNavigate();

  async function handleDelete() {
    if (!id) {
      return;
    }
    const result = await deleteVacancy(id);
    if (!result) return;
    navigate("/vacancies");
  }

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        return;
      }
      const result = await getVacanciesById(id);
      setState(result);
    };
    loadData();
  }, [id]);

  return state ? (
    <>
      <h1>{state.title}</h1>
      <VacancyCard vacancy={state} />
      {user && user.role === "employer" && user.id === state.createdBy && (
        <>
          <Link to={`/edit-vacancy/${id}`}>Edit</Link>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
    </>
  ) : (
    "Loading..."
  );
};

export default VacancyDetailsPage;
