import { useState, useEffect } from "react";
import React from "react";
import { type Vacancy, type Company } from "../types/vacancy";

export interface VacancyFormProps {
  initialData?: Omit<Vacancy, "id" | "createdBy">;
  onSubmit: (data: Omit<Vacancy, "id" | "createdBy">) => void;
  submitLabel: string;
  error?: string | null;
}

export default function VacancyForm({
  initialData,
  onSubmit,
  submitLabel,
  error,
}: VacancyFormProps) {
  const [company, setCompany] = useState<Company>({
    name: "",
    description: "",
    contactEmail: "",
    contactPhone: "",
  });
  const [title, setTitle] = useState<string>("");
  const [type, setType] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [salary, setSalary] = useState<string>("");

  function handleSetCompanyChange(
    companyInfo: "name" | "description" | "contactEmail" | "contactPhone",
    newCompany: string,
  ) {
    setCompany((prev) => ({ ...prev, [companyInfo]: newCompany }));
  }
  useEffect(() => {
    if (!initialData) {
      return;
    }
    setTitle(initialData.title);
    setType(initialData.type);
    setLocation(initialData.location);
    setDescription(initialData.description);
    setCompany(initialData.company);
    setSalary(initialData.salary);
  }, [initialData]);

  function handleSubmit(form: React.FormEvent<HTMLFormElement>) {
    form.preventDefault();
    const newForm: Omit<Vacancy, "id" | "createdBy"> = {
      title,
      type,
      location,
      description,
      salary,
      company,
    };
    onSubmit(newForm);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="title">Title: </label>
      <input
        id="title"
        type="text"
        value={title}
        onChange={(event) => setTitle(event.target.value)}
      />
      <label htmlFor="type">Type: </label>
      <select
        id="type"

        value={type}
        onChange={(event) => setType(event.target.value)}
      >
        <option value="" disabled>
          Select type
        </option>
        <option value="Full-Time">Full time</option>
        <option value="Part-Time">Part-Time</option>
        <option value="Contract">Contract</option>
        <option value="Internship">Internship</option>
      </select>
      <label htmlFor="location">Location: </label>
      <input
        id="location"
        type="text"
        value={location}
        onChange={(event) => setLocation(event.target.value)}
      />
      <label htmlFor="description">Description: </label>
      <input
        id="description"
        type="text"
        value={description}
        onChange={(event) => setDescription(event.target.value)}
      />
      <label htmlFor="salary">Salary: </label>
      <input
        id="salary"
        type="text"
        value={salary}
        onChange={(event) => setSalary(event.target.value)}
      />
      <label htmlFor="company.name">Company name: </label>
      <input
        id="company.name"
        type="text"
        value={company.name}
        onChange={(event) => handleSetCompanyChange("name", event.target.value)}
      />
      <label htmlFor="company.contactEmail">Contact email: </label>
      <input
        id="company.contactEmail"
        type="email"
        value={company.contactEmail}
        onChange={(event) =>
          handleSetCompanyChange("contactEmail", event.target.value)
        }
      />
      <label htmlFor="company.contactPhone">Contact phone: </label>
      <input
        id="company.contactPhone"
        type="tel"
        value={company.contactPhone}
        onChange={(event) =>
          handleSetCompanyChange("contactPhone", event.target.value)
        }
      />
      <label htmlFor="company.description">Company description: </label>
      <input
        id="company.description"
        type="text"
        value={company.description}
        onChange={(event) =>
          handleSetCompanyChange("description", event.target.value)
        }
      />
      {error && <p>{error}</p>}
      <button type="submit">{submitLabel}</button>
    </form>
  );
}
