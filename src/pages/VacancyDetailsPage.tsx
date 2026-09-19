import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getVacancyById, deleteVacancy } from "../services/vacancyApi";
import { getErrorMessage } from "../services/apiClient";
import { type Vacancy } from "../types/vacancy";
import { useAuth } from "../app/AuthContext";
import {
  hasApplied,
  applyToVacancy,
  cancelApplication,
} from "../services/applicationApi";

const VacancyDetailsPage = () => {
  const [state, setState] = useState<Vacancy | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [applied, setApplied] = useState<boolean | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] ?? null;

    if (!file) {
      setResumeFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!allowedTypes.includes(file.type)) {
      setFileError("Only PDF and DOCX files are allowed");
      setResumeFile(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFileError("File must be under 5MB");
      setResumeFile(null);
      return;
    }

    setFileError(null);
    setResumeFile(file);
  }

  async function handleDelete() {
    if (!id || isDeleting) return;
    if (
      !window.confirm(
        "Delete this vacancy? All applications to it will be deleted too.",
      )
    ) {
      return;
    }
    setError(null);
    setIsDeleting(true);
    try {
      await deleteVacancy(id);
      navigate("/vacancies");
    } catch (e) {
      setError(getErrorMessage(e, "Unable to delete job"));
      setIsDeleting(false);
    }
  }

  async function handleApplyToggle() {
    if (!user || !id || isApplying) return;
    setError(null);
    setIsApplying(true);
    try {
      if (applied) {
        await cancelApplication(id);
        setApplied(false);
      } else {
        await applyToVacancy(id, resumeFile);
        setApplied(true);
        setResumeFile(null);
      }
    } catch (e) {
      setError(getErrorMessage(e));
    } finally {
      setIsApplying(false);
    }
  }

  useEffect(() => {
    if (!id) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;

    const loadData = async () => {
      try {
        const vacancy = await getVacancyById(id);
        if (cancelled) return;
        setState(vacancy);

        if (user?.role === "jobseeker") {
          const appliedResult = await hasApplied(id);
          if (!cancelled) setApplied(appliedResult);
        }
      } catch (e) {
        console.error(e);
        if (!cancelled) setState(null);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadData();
    return () => {
      cancelled = true;
    };
  }, [user, id]);

  if (isLoading) {
    return <p className="text-slate-500">Loading...</p>;
  }

  if (!state) {
    return <p className="text-slate-500">Vacancy not found.</p>;
  }

  return (
    <article className="max-w-3xl space-y-8">
      <header className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            {state.title}
          </h1>
          <p className="text-lg text-slate-700">{state.company.name}</p>
          <p className="text-xl font-semibold text-slate-900">
            {state.salary ? state.salary : "Salary is hidden"}
          </p>
          <p className="text-sm text-slate-600">
            {state.location}
            <span className="mx-1.5 text-slate-300">·</span>
            {state.type}
          </p>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {!user && (
          <div className="flex flex-wrap items-center gap-3 rounded-md border border-slate-200 bg-white px-4 py-3 text-sm text-slate-600">
            <span>Want to apply for this job?</span>
            <Link
              to="/login"
              state={{ from: `/vacancies/${id}` }}
              className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
            >
              Login to apply
            </Link>
            <Link
              to="/register"
              className="font-medium text-blue-600 hover:text-blue-700"
            >
              or create an account
            </Link>
          </div>
        )}
        {user?.role === "jobseeker" && (
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
            <button
              onClick={handleApplyToggle}
              disabled={isApplying || applied === null}
              className={
                (applied
                  ? "inline-flex items-center justify-center rounded-md bg-slate-700 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
                  : "inline-flex items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700") +
                " disabled:cursor-not-allowed disabled:opacity-60"
              }
            >
              {isApplying
                ? "Please wait..."
                : applied
                  ? "Cancel application"
                  : "Apply"}
            </button>

            {!applied && (
              <div className="flex flex-col gap-1">
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    id="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="sr-only"
                  />
                  <label
                    htmlFor="resume"
                    className="inline-flex cursor-pointer items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {resumeFile ? "Змінити файл" : "Вибрати файл"}
                  </label>
                  {resumeFile && (
                    <span className="text-sm text-slate-600">
                      {resumeFile.name}
                    </span>
                  )}
                </div>
                {fileError && (
                  <p className="text-sm text-red-600">{fileError}</p>
                )}
              </div>
            )}
          </div>
        )}

        {user?.role === "employer" && user.id === state.createdBy && (
          <div className="flex flex-wrap items-center gap-3">
            <Link
              to={`/edit-vacancy/${id}`}
              className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Edit
            </Link>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className="inline-flex items-center justify-center rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </button>
          </div>
        )}
      </header>

      <section className="space-y-4 border-t border-slate-200 pt-8">
        <h2 className="text-lg font-semibold text-slate-900">Про вакансію</h2>
        <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-700">
          {state.description ? state.description : "There is no description."}
        </p>
      </section>

      <section className="space-y-4 border-t border-slate-200 pt-8">
        <h2 className="text-lg font-semibold text-slate-900">Про компанію</h2>
        <p className="whitespace-pre-wrap text-base leading-relaxed text-slate-700">
          {state.company.description
            ? state.company.description
            : "There is no description."}
        </p>
        <div className="space-y-1 text-sm text-slate-600">
          {state.company.contactEmail && <p>{state.company.contactEmail}</p>}
          {state.company.contactPhone && <p>{state.company.contactPhone}</p>}
        </div>
      </section>
    </article>
  );
};

export default VacancyDetailsPage;
