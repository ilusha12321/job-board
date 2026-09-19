import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../app/AuthContext";
import type { Vacancy } from "../types/vacancy";
import type { Application } from "../types/application";
import { getVacancies } from "../services/vacancyApi";
import { getMyApplications } from "../services/applicationApi";
import VacancyCard from "../components/VacancyCard";

type Item = {
  vacancy: Vacancy;
  status: Application["status"];
  appliedAt: string;
};
type ApplicationStatus = Application["status"];

const STATUS_STYLES: {
  [K in ApplicationStatus]: { label: string; className: string };
} = {
  delivered: { label: "Delivered", className: "bg-slate-100 text-slate-700" },
  reviewed: { label: "Reviewed", className: "bg-amber-50 text-amber-700" },
  "invite for interview": {
    label: "Interview invitation",
    className: "bg-green-50 text-green-700",
  },
};

export default function MyApplicationsPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    let cancelled = false;

    const loadData = async () => {
      try {
        const [applications, vacancies] = await Promise.all([
          getMyApplications(),
          getVacancies(),
        ]);
        if (cancelled) return;

        const byId = new Map(vacancies.map((v) => [v.id, v]));
        setItems(
          applications.flatMap((app) => {
            const vacancy = byId.get(app.vacancyId);
            return vacancy
              ? [{ vacancy, status: app.status, appliedAt: app.appliedAt }]
              : [];
          }),
        );
      } catch (error) {
        console.error(error);
        if (!cancelled) setItems([]);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadData();
    return () => {
      cancelled = true;
    };
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

      {items.length === 0 ? (
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
          {items.map(({ vacancy, status, appliedAt }) => (
            <div key={vacancy.id} className="space-y-2">
              <VacancyCard vacancy={vacancy} isClickable={true} />
              <div className="flex flex-wrap items-center gap-3 px-1 text-sm">
                <span
                  className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_STYLES[status].className}`}
                >
                  {STATUS_STYLES[status].label}
                </span>
                <span className="text-slate-500">
                  Applied {new Date(appliedAt).toLocaleDateString("en-GB")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
