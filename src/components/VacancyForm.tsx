import { useState, type FormEvent } from "react";
import { type Vacancy } from "../types/vacancy";

type VacancyFormProps = {
  onSubmit: (data: Omit<Vacancy, "id" | "createdBy">) => void;
  submitLabel: string;
  error?: string | null;
  initialData?: Vacancy | null;
};

export default function VacancyForm({
  onSubmit,
  submitLabel,
  error,
  initialData,
}: VacancyFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [type, setType] = useState(initialData?.type ?? "Full-Time");
  const [location, setLocation] = useState(initialData?.location ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? "",
  );
  const [salary, setSalary] = useState(initialData?.salary ?? "");
  const [companyName, setCompanyName] = useState(
    initialData?.company.name ?? "",
  );
  const [companyDescription, setCompanyDescription] = useState(
    initialData?.company.description ?? "",
  );
  const [companyEmail, setCompanyEmail] = useState(
    initialData?.company.contactEmail ?? "",
  );
  const [companyPhone, setCompanyPhone] = useState(
    initialData?.company.contactPhone ?? "",
  );

  function handleSubmit(event: FormEvent) {
    event.preventDefault();

    onSubmit({
      title,
      type,
      location,
      description,
      salary,
      company: {
        name: companyName,
        description: companyDescription,
        contactEmail: companyEmail,
        contactPhone: companyPhone,
      },
    });
  }

  const fieldClass =
    "w-full rounded-md border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100";

  const labelClass = "block text-sm font-medium text-slate-700";

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-3xl space-y-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
    >
      <div className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          {submitLabel} vacancy
        </h1>
        <p className="text-sm text-slate-500">
          Add the vacancy details and company information.
        </p>
      </div>

      <section className="space-y-5">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Vacancy details
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Provide the main information about the position.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="title" className={labelClass}>
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Frontend Developer"
              autoComplete="organization-title"
              required
              className={fieldClass}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="type" className={labelClass}>
              Type
            </label>
            <select
              id="type"
              name="type"
              value={type}
              onChange={(e) => setType(e.target.value)}
              className={fieldClass}
            >
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Contract">Contract</option>
              <option value="Internship">Internship</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label htmlFor="location" className={labelClass}>
              Location
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Kyiv, Ukraine"
              autoComplete="address-level2"
              required
              className={fieldClass}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="salary" className={labelClass}>
              Salary
            </label>
            <input
              id="salary"
              name="salary"
              type="text"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
              placeholder="e.g. $1200–1600"
              className={fieldClass}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="description" className={labelClass}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe responsibilities, requirements and working conditions..."
              required
              rows={7}
              className={`${fieldClass} resize-y`}
            />
          </div>
        </div>
      </section>

      <section className="space-y-5 border-t border-slate-200 pt-7">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Company information
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Add information candidates can use to learn more about the company.
          </p>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="companyName" className={labelClass}>
              Company name
            </label>
            <input
              id="companyName"
              name="companyName"
              type="text"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="e.g. Acme Inc."
              autoComplete="organization"
              required
              className={fieldClass}
            />
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <label htmlFor="companyDescription" className={labelClass}>
              Company description
            </label>
            <textarea
              id="companyDescription"
              name="companyDescription"
              value={companyDescription}
              onChange={(e) => setCompanyDescription(e.target.value)}
              placeholder="Tell candidates briefly about your company..."
              rows={4}
              className={`${fieldClass} resize-y`}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="companyEmail" className={labelClass}>
              Contact email
            </label>
            <input
              id="companyEmail"
              name="companyEmail"
              type="email"
              value={companyEmail}
              onChange={(e) => setCompanyEmail(e.target.value)}
              placeholder="hr@company.com"
              autoComplete="email"
              required
              className={fieldClass}
            />
          </div>

          <div className="space-y-1.5">
            <label htmlFor="companyPhone" className={labelClass}>
              Contact phone
            </label>
            <input
              id="companyPhone"
              name="companyPhone"
              type="tel"
              value={companyPhone}
              onChange={(e) => setCompanyPhone(e.target.value)}
              placeholder="+380..."
              autoComplete="tel"
              className={fieldClass}
            />
          </div>
        </div>
      </section>

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs text-slate-500">
          Fields marked as required must be completed.
        </p>

        <button
          type="submit"
          className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:w-auto"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
