import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
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

  if (isLoading) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          My applications
        </h1>
        <p className="text-sm text-slate-500">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          My applications
        </h1>
        <p className="text-sm text-slate-500">Vacancies you have applied to.</p>
      </div>

      {vacancyList.length === 0 ? (
        <div className="border-t border-slate-200 py-10 text-center">
          <h2 className="text-base font-semibold text-slate-900">
            No applications yet
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Find a vacancy that interests you and submit your application.
          </p>
          <Link
            to="/vacancies"
            className="mt-5 inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
          >
            Browse vacancies
          </Link>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {vacancyList.map((vacancy) => (
            <VacancyCard
              key={vacancy.id}
              vacancy={vacancy}
              isClickable={true}
            />
          ))}
        </div>
      )}
    </div>
  );
}
