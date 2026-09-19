import {
  type RawVacancy,
  type RawVacancyInput,
  type Vacancy,
  type RawMyVacancy,
  type MyVacancy,
} from "../types/vacancy";
import { apiFetch } from "./apiClient";

export async function getVacancies(): Promise<Vacancy[]> {
  const data = await apiFetch<RawVacancy[]>("/vacancies");
  return data.map(adaptVacancy);
}
export async function getMyVacancies(): Promise<MyVacancy[]> {
  const data = await apiFetch<RawMyVacancy[]>("/vacancies/mine");
  return data.map((raw) => ({
    ...adaptVacancy(raw),
    applicationsCount: raw.applications_count,
    newCount: raw.new_count,
  }));
}
export async function getVacancyById(id: string): Promise<Vacancy> {
  const data = await apiFetch<RawVacancy>(`/vacancies/${id}`);
  return adaptVacancy(data);
}

export async function createVacancy(
  newVacancy: Omit<Vacancy, "id">,
): Promise<Vacancy> {
  const data = await apiFetch<RawVacancy>("/vacancies", {
    method: "POST",
    json: toRawVacancy(newVacancy),
  });
  return adaptVacancy(data);
}

export async function updateVacancy(
  id: string,
  updatedVacancy: Omit<Vacancy, "id">,
): Promise<Vacancy> {
  const data = await apiFetch<RawVacancy>(`/vacancies/${id}`, {
    method: "PUT",
    json: toRawVacancy(updatedVacancy),
  });
  return adaptVacancy(data);
}

export async function deleteVacancy(id: string): Promise<void> {
  await apiFetch<void>(`/vacancies/${id}`, { method: "DELETE" });
}

function adaptVacancy(raw: RawVacancy): Vacancy {
  return {
    id: raw.id,
    title: raw.title,
    type: raw.type,
    location: raw.location,
    description: raw.description,
    salary: raw.salary ?? "",
    company: {
      name: raw.company_name,
      description: raw.company_description ?? "",
      contactEmail: raw.company_contact_email,
      contactPhone: raw.company_contact_phone ?? "",
    },
    createdBy: raw.created_by,
  };
}

function toRawVacancy(vacancy: Omit<Vacancy, "id">): RawVacancyInput {
  return {
    title: vacancy.title,
    type: vacancy.type,
    location: vacancy.location,
    description: vacancy.description,
    salary: vacancy.salary,
    company_name: vacancy.company.name,
    company_description: vacancy.company.description,
    company_contact_email: vacancy.company.contactEmail,
    company_contact_phone: vacancy.company.contactPhone,
  };
}
