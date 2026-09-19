import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyVacancies, deleteVacancy } from "../services/vacancyApi";
import type { MyVacancy } from "../types/vacancy";
import { getErrorMessage } from "../services/apiClient";

type Status = "loading" | "error" | "ready";

export default function MyVacanciesPage() {
  const [vacancies, setVacancies] = useState<MyVacancy[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  useEffect(() => {
    let cancelled = false;

    getMyVacancies()
      .then((result) => {
        if (cancelled) return;
        setVacancies(result);
        setStatus("ready");
      })
      .catch((error) => {
        console.error(error);
        if (!cancelled) setStatus("error");
      });

    return () => {
      cancelled = true;
    };
  }, []);
  async function handleDelete(vacancy: MyVacancy) {
    if (deletingId) return;

    const warning =
      vacancy.applicationsCount > 0
        ? `Delete "${vacancy.title}"? ${vacancy.applicationsCount} application(s) will be deleted too.`
        : `Delete "${vacancy.title}"?`;

    if (!window.confirm(warning)) return;

    setDeleteError(null);
    setDeletingId(vacancy.id);
    try {
      await deleteVacancy(vacancy.id);
      setVacancies((current) => current.filter((v) => v.id !== vacancy.id));
    } catch (e) {
      setDeleteError(getErrorMessage(e, "Unable to delete vacancy"));
    } finally {
      setDeletingId(null);
    }
  }
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My vacancies
          </h1>
          <p className="text-sm text-slate-500">
            Vacancies you have published and their applications.
          </p>
        </div>
        <Link
          to="/create-vacancy"
          className="inline-flex w-fit items-center justify-center rounded-md bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          Create vacancy
        </Link>
      </div>

      {deleteError && (
        <div
          role="alert"
          className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600"
        >
          {deleteError}
        </div>
      )}

      {status === "loading" && (
        <p className="text-sm text-slate-500">Loading vacancies...</p>
      )}

      {status === "error" && (
        <div className="border-t border-slate-200 py-10 text-center">
          <h2 className="text-base font-semibold text-slate-900">
            Failed to load vacancies
          </h2>
          <p className="mt-1 text-sm text-slate-500">Please try again later.</p>
        </div>
      )}

      {status === "ready" && vacancies.length === 0 && (
        <div className="border-t border-slate-200 py-10 text-center">
          <h2 className="text-base font-semibold text-slate-900">
            No vacancies yet
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Create your first vacancy to start receiving applications.
          </p>
        </div>
      )}

      {status === "ready" && vacancies.length > 0 && (
        <div className="flex flex-col gap-4">
          {vacancies.map((vacancy) => (
            <article
              key={vacancy.id}
              className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 space-y-1">
                  <Link
                    to={`/vacancies/${vacancy.id}`}
                    className="text-lg font-semibold text-slate-900 transition-colors hover:text-blue-600"
                  >
                    {vacancy.title}
                  </Link>
                  <p className="text-sm text-slate-600">
                    {vacancy.location}
                    <span className="mx-1.5 text-slate-300">·</span>
                    {vacancy.type}
                  </p>
                  <p className="text-sm text-slate-500">
                    {vacancy.salary ? vacancy.salary : "Salary not specified"}
                  </p>
                </div>

                <div className="flex shrink-0 flex-wrap items-center gap-2 text-sm">
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                    {vacancy.applicationsCount}{" "}
                    {vacancy.applicationsCount === 1
                      ? "application"
                      : "applications"}
                  </span>
                  {vacancy.newCount > 0 && (
                    <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      {vacancy.newCount} new
                    </span>
                  )}
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-slate-100 pt-4 text-sm">
                <Link
                  to={`/employer-applications?vacancy=${vacancy.id}`}
                  className="font-medium text-blue-600 hover:text-blue-700 hover:underline"
                >
                  View applications
                </Link>

                <Link
                  to={`/edit-vacancy/${vacancy.id}`}
                  className="font-medium text-slate-600 hover:text-slate-900 hover:underline"
                >
                  Edit
                </Link>

                <button
                  type="button"
                  onClick={() => handleDelete(vacancy)}
                  disabled={deletingId === vacancy.id}
                  className="font-medium text-red-600 hover:text-red-700 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {deletingId === vacancy.id ? "Deleting..." : "Delete"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
