import { useState, useEffect } from "react";
import { useAuth } from "../app/AuthContext";
import type { Vacancy } from "../types/vacancy";
import { getVacancies } from "../services/vacancyApi";
import { getMyApplications } from "../services/applicationApi";
import VacancyCard from "../components/VacancyCard";

export default function MyApplicationsPage() {
  const [vacancyList, setVacancyList] = useState<Vacancy[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();
  useEffect(() => {
    if (!user) return;

    const loadData = async () => {
      const applications = await getMyApplications();
      const result = await getVacancies();
      if (!result) {
        setVacancyList([]);
        setIsLoading(false);
        return;
      }

      const filtered = result.filter((vacancy) =>
        applications.some((app) => app.vacancyId === vacancy.id),
      );

      setVacancyList(filtered);
      setIsLoading(false);
    };

    loadData();
  }, [user]);
  return (
    <>
      {isLoading ? (
        <p>Loading...</p>
      ) : vacancyList.length === 0 ? (
        "You don't have any reviews yet."
      ) : (
        vacancyList.map((vacancy) => (
          <VacancyCard key={vacancy.id} vacancy={vacancy} isClickable={true} />
        ))
      )}
    </>
  );
}
