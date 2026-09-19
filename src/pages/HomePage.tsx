import { type FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const POPULAR = [
  "Frontend Developer",
  "React",
  "JavaScript",
  "QA Engineer",
  "Backend Developer",
  "Remote",
] as const;

function HomePage() {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  function handleSearch(event: FormEvent) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (keyword.trim()) params.set("q", keyword.trim());
    if (location.trim()) params.set("location", location.trim());
    const query = params.toString();
    navigate(query ? `/vacancies?${query}` : "/vacancies");
  }

  function goPopular(term: string) {
    if (term.toLowerCase() === "remote") {
      navigate("/vacancies?location=Remote");
      return;
    }
    navigate(`/vacancies?q=${encodeURIComponent(term)}`);
  }

  return (
    <div className="space-y-12">
      <section className="space-y-6">
        <div className="max-w-2xl space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Find your next job
          </h1>
          <p className="text-lg leading-relaxed text-slate-600 md:whitespace-nowrap">
            Search verified vacancies, apply online, or post openings for your
            company — all in one place.
          </p>
        </div>

        <form
          onSubmit={handleSearch}
          className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
        >
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Job title or keyword"
            className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="City or location"
            className="min-w-0 flex-1 rounded-md border border-slate-300 px-3 py-2.5 text-sm outline-none focus:border-blue-500"
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700 sm:shrink-0"
          >
            Search
          </button>
        </form>
      </section>

      <section className="space-y-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Popular directions
        </h2>
        <div className="flex flex-wrap gap-2">
          {POPULAR.map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => goPopular(term)}
              className="rounded-full border border-slate-200 bg-white px-3.5 py-1.5 text-sm text-slate-700 hover:border-blue-300 hover:text-blue-600"
            >
              {term}
            </button>
          ))}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl space-y-1">
            <h2 className="text-lg font-semibold text-slate-900">
              Hiring for your company?
            </h2>
            <p className="text-sm leading-relaxed text-slate-600">
              Post a vacancy and reach candidates looking for their next role.
            </p>
          </div>
          <Link
            to="/create-vacancy"
            className="inline-flex shrink-0 items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-800 hover:bg-slate-50"
          >
            Post a vacancy
          </Link>
        </div>
      </section>

      <section className="grid gap-6 sm:grid-cols-3">
        <div className="space-y-1 border-t border-slate-200 pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-4 first:border-l-0 first:pl-0">
          <h3 className="text-sm font-semibold text-slate-900">
            Search vacancies
          </h3>
          <p className="text-sm leading-relaxed text-slate-600">
            Filter by title, location and employment type to find a match.
          </p>
        </div>
        <div className="space-y-1 border-t border-slate-200 pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Apply to jobs
          </h3>
          <p className="text-sm leading-relaxed text-slate-600">
            Submit an application and optionally attach your resume.
          </p>
        </div>
        <div className="space-y-1 border-t border-slate-200 pt-4 sm:border-t-0 sm:border-l sm:pt-0 sm:pl-4">
          <h3 className="text-sm font-semibold text-slate-900">
            Post vacancies
          </h3>
          <p className="text-sm leading-relaxed text-slate-600">
            Employers can create, edit and manage openings in one place.
          </p>
        </div>
      </section>
    </div>
  );
}

export default HomePage;
