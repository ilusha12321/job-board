import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import VacancyCard from "../components/VacancyCard";
import { type Vacancy } from "../types/vacancy";
import { getVacancies } from "../services/vacancyApi";
import { useAuth } from "../app/AuthContext";

const VacanciesPage = () => {
  const [searchParams] = useSearchParams();
  const [state, setState] = useState<Vacancy[]>([]);
  const [searchTerm, setSearchTerm] = useState(searchParams.get("q") ?? "");
  const [locationTerm, setLocationTerm] = useState(
    searchParams.get("location") ?? "",
  );
  const [selectedType, setSelectedType] = useState(
    searchParams.get("type") ?? "",
  );
  const [status, setStatus] = useState<"loading" | "error" | "success">(
    "loading",
  );

  const { user } = useAuth();

  useEffect(() => {
    setSearchTerm(searchParams.get("q") ?? "");
    setLocationTerm(searchParams.get("location") ?? "");
    setSelectedType(searchParams.get("type") ?? "");
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;

    getVacancies()
      .then((result) => {
        if (cancelled) return;
        setState(result);
        setStatus("success");
      })
      .catch((error) => {
        console.error(error);
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredVacancies = state.filter((vacancy) => {
    const matchesTitle = vacancy.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesLocation =
      locationTerm === "" ||
      vacancy.location.toLowerCase().includes(locationTerm.toLowerCase());

    const matchesType = selectedType === "" || vacancy.type === selectedType;

    return matchesTitle && matchesLocation && matchesType;
  });

  const hasFilters =
    searchTerm.trim() !== "" ||
    locationTerm.trim() !== "" ||
    selectedType !== "";

  const clearFilters = () => {
    setSearchTerm("");
    setLocationTerm("");
    setSelectedType("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Vacancies
          </h1>
          <p className="text-sm text-slate-500">
            Find a position that matches your experience and goals.
          </p>
        </div>

        {user?.role === "employer" && (
          <Link
            to="/create-vacancy"
            className="inline-flex w-fit items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create vacancy
          </Link>
        )}
      </div>

      <div className="border-y border-slate-200 py-4">
        <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_180px_auto]">
          <input
            id="searchTerm"
            type="text"
            placeholder="Search by title"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <input
            type="text"
            placeholder="Location"
            value={locationTerm}
            onChange={(event) => setLocationTerm(event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

          <select
            id="selectedType"
            value={selectedType}
            onChange={(event) => setSelectedType(event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            <option value="">All types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
          </select>

          {hasFilters && (
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-600 transition-colors hover:border-slate-400 hover:text-slate-900"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {status === "success" && (
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <p className="text-sm text-slate-500">
            {filteredVacancies.length}{" "}
            {filteredVacancies.length === 1 ? "vacancy" : "vacancies"}
          </p>

          {hasFilters && (
            <p className="text-sm text-slate-400">
              Filtered from {state.length}
            </p>
          )}
        </div>
      )}

      <div>
        {status === "error" ? (
          <div className="border-t border-slate-200 py-10 text-center">
            <h2 className="text-base font-semibold text-slate-900">
              Failed to load vacancies
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Please try again later.
            </p>
          </div>
        ) : status === "loading" ? (
          <p className="text-sm text-slate-500">Loading vacancies...</p>
        ) : filteredVacancies.length === 0 ? (
          <div className="border-t border-slate-200 py-10 text-center">
            <h2 className="text-base font-semibold text-slate-900">
              No vacancies found
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Try changing your search or filters.
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {filteredVacancies.map((vacancy, index) => (
              <VacancyCard
                key={vacancy.id}
                vacancy={vacancy}
                isClickable={true}
                displayNumber={index + 1}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VacanciesPage;
