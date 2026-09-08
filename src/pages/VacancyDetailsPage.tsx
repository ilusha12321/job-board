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
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const { id } = useParams<{ id: string }>();

  const { user } = useAuth();

  const navigate = useNavigate();

  async function handleDelete() {
    setError(null);
    if (!id) {
      return;
    }
    const result = await deleteVacancy(id);
    if (!result) return setError("Unable to delete job");
    navigate("/vacancies");
  }

  useEffect(() => {
    const loadData = async () => {
      if (!id) {
        return;
      }
      const result = await getVacanciesById(id);
      setIsLoading(false);
      setState(result);
    };
    loadData();
  }, [id]);

  return isLoading ? (
    "Loading..."
  ) : state ? (
    <>
      <h1>{state.title}</h1>
      <VacancyCard vacancy={state} />
      <div>
        {state.description ? state.description : "There is no description."}
      </div>
      <div>{state.company.contactPhone}</div>
      <div>{state.company.contactEmail}</div>
      <div>
        {state.company.description
          ? state.company.description
          : "There is no description."}
      </div>
      {user && user.role === "employer" && user.id === state.createdBy && (
        <>
          {error && <p>{error}</p>}
          <Link to={`/edit-vacancy/${id}`}>Edit</Link>
          <button onClick={handleDelete}>Delete</button>
        </>
      )}
    </>
  ) : (
    "Vacancy not found."
  );
};

export default VacancyDetailsPage;
