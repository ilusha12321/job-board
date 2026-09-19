import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  getEmployerApplications,
  updateApplicationStatus,
} from "../services/applicationApi";
import { API_URL } from "../services/apiClient";
import type { EmployerApplication } from "../types/application";

type StatusFilter = "all" | "delivered" | "reviewed" | "invite for interview";

export default function EmployerApplicationsPage() {
  const [applications, setApplications] = useState<EmployerApplication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [searchParams, setSearchParams] = useSearchParams();
  const vacancyFilter = searchParams.get("vacancy");
  const [updatingApplicationId, setUpdatingApplicationId] = useState<
    string | null
  >(null);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const result = await getEmployerApplications();
        if (!cancelled) setApplications(result);
      } catch (error) {
        console.error(error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadData();
    return () => {
      cancelled = true;
    };
  }, []);

  const filteredApplications = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();

    return applications.filter((application) => {
      const matchesSearch =
        query === "" ||
        application.applicantUsername.toLowerCase().includes(query) ||
        application.applicantEmail.toLowerCase().includes(query) ||
        application.vacancyTitle.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" || application.status === statusFilter;

      const matchesVacancy =
        !vacancyFilter || application.vacancyId === vacancyFilter;

      return matchesSearch && matchesStatus && matchesVacancy;
    });
  }, [applications, searchTerm, statusFilter, vacancyFilter]);

  const deliveredCount = applications.filter(
    (application) => application.status === "delivered",
  ).length;

  const reviewedCount = applications.filter(
    (application) => application.status === "reviewed",
  ).length;

  const interviewCount = applications.filter(
    (application) => application.status === "invite for interview",
  ).length;

  async function handleStatusChange(
    applicationId: string,
    status: EmployerApplication["status"],
  ) {
    setUpdatingApplicationId(applicationId);
    try {
      const updated = await updateApplicationStatus(applicationId, status);
      setApplications((current) =>
        current.map((application) =>
          application.id === updated.id ? updated : application,
        ),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setUpdatingApplicationId(null);
    }
  }
  if (isLoading) {
    return (
      <div className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Applications
        </h1>
        <p className="text-sm text-slate-500">Loading applications...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Applications for my vacancies
        </h1>
        <p className="text-sm text-slate-500">
          Review candidates who applied to your vacancies.
        </p>
      </div>

      {vacancyFilter && (
        <div className="flex items-center justify-between rounded-md border border-blue-100 bg-blue-50 px-4 py-2.5 text-sm text-blue-800">
          <span>Showing applications for one vacancy only.</span>
          <button
            type="button"
            onClick={() => setSearchParams({})}
            className="font-medium hover:underline"
          >
            Show all
          </button>
        </div>
      )}
      {applications.length > 0 && (
        <div className="border-b border-slate-200">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`border-b-2 py-3 text-sm font-medium transition-colors ${
                statusFilter === "all"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              All ({applications.length})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter("delivered")}
              className={`border-b-2 py-3 text-sm font-medium transition-colors ${
                statusFilter === "delivered"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              Delivered ({deliveredCount})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter("reviewed")}
              className={`border-b-2 py-3 text-sm font-medium transition-colors ${
                statusFilter === "reviewed"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              Reviewed ({reviewedCount})
            </button>

            <button
              type="button"
              onClick={() => setStatusFilter("invite for interview")}
              className={`border-b-2 py-3 text-sm font-medium transition-colors ${
                statusFilter === "invite for interview"
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-slate-500 hover:text-slate-900"
              }`}
            >
              Interview ({interviewCount})
            </button>
          </div>
        </div>
      )}

      {applications.length > 0 && (
        <div className="border-b border-slate-200 pb-4">
          <input
            type="search"
            placeholder="Search applicant or vacancy..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>
      )}

      {applications.length === 0 ? (
        <div className="border-t border-slate-200 py-10 text-center">
          <h2 className="text-base font-semibold text-slate-900">
            No applications yet
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Applications from candidates will appear here.
          </p>
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="border-t border-slate-200 py-10 text-center">
          <h2 className="text-base font-semibold text-slate-900">
            No matching applications
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Try changing your search or status filter.
          </p>
        </div>
      ) : (
        <div className="border-y border-slate-200">
          {filteredApplications.map((application) => (
            <article
              key={application.id}
              className="border-b border-slate-200 py-6 last:border-b-0"
            >
              <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 space-y-4">
                  <div className="space-y-1">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                      Vacancy
                    </p>

                    <Link
                      to={`/vacancies/${application.vacancyId}`}
                      className="text-base font-semibold text-slate-900 transition-colors hover:text-blue-600"
                    >
                      {application.vacancyTitle}
                    </Link>
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Applicant
                      </p>
                      <p className="mt-1 text-sm font-medium text-slate-900">
                        {application.applicantUsername}
                      </p>
                      <p className="mt-0.5 text-sm text-slate-500">
                        {application.applicantEmail}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                        Applied
                      </p>
                      <p className="mt-1 text-sm text-slate-700">
                        {new Date(application.appliedAt).toLocaleString(
                          "uk-UA",
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-3">
                  <span className="text-xs text-slate-400">Status</span>

                  <select
                    value={application.status}
                    disabled={updatingApplicationId === application.id}
                    onChange={(event) =>
                      handleStatusChange(
                        application.id,
                        event.target.value as EmployerApplication["status"],
                      )
                    }
                    className="rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-700 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <option value="delivered">Delivered</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="invite for interview">Interview</option>
                  </select>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-4">
                {application.resumeName ? (
                  <a
                    href={`${API_URL}/applications/${application.id}/resume`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 hover:underline"
                  >
                    Download resume
                    <span className="ml-1.5 font-normal text-slate-500">
                      ({application.resumeName})
                    </span>
                  </a>
                ) : (
                  <span className="text-sm text-slate-400">
                    No resume attached
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
