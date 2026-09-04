import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getVacanciesById } from "../services/vacancyApi";
import { type Vacancy } from "../types/vacancy";
import VacancyCard from "../components/VacancyCard";

const VacancyDetailsPage = () => {
  const [state, setState] = useState<Vacancy | null>();
  const { id } = useParams<{ id: string }>();
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

  return (
    <>
      <h1>{id}</h1>
      {state ? <VacancyCard vacancy={state} /> : "Loading..."}
    </>
  );
};

export default VacancyDetailsPage;
