import VacancyCard from "../components/VacancyCard";
import { useEffect, useState } from "react";
import { type Vacancy } from "../types/vacancy";
import { getVacancies } from "../services/vacancyApi";

const VacanciesPage = () => {
  const [state, setState] = useState<Vacancy[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    const loadData = async () => {
      const result = await getVacancies();
      setState(result);
      setIsLoading(false);
    };
    loadData();
  }, []);
  return (
    <>
      <h1>Vacantion list</h1>
      <div>
        {isLoading ? (
          <p>Loading... </p>
        ) : (
          state.map((vacancy) => (
            <VacancyCard
              key={vacancy.id}
              vacancy={vacancy}
              isClickable={true}
            />
          ))
        )}
      </div>
    </>
  );
};
export default VacanciesPage;
