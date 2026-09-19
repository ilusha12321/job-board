import {
  type Application,
  type RawApplication,
  type EmployerApplication,
  type RawEmployerApplication,
} from "../types/application";
import { apiFetch } from "./apiClient";

function adaptApplication(raw: RawApplication): Application {
  return {
    id: raw.id,
    userId: raw.user_id,
    vacancyId: raw.vacancy_id,
    appliedAt: raw.created_at,
    status: raw.status,
  };
}

function adaptEmployerApplication(
  raw: RawEmployerApplication,
): EmployerApplication {
  return {
    id: raw.id,
    vacancyId: raw.vacancy_id,
    vacancyTitle: raw.title,
    applicantUsername: raw.username,
    applicantEmail: raw.email,
    appliedAt: raw.created_at,
    status: raw.status,
    resumeName: raw.resume_name,
  };
}

export async function getMyApplications(): Promise<Application[]> {
  const data = await apiFetch<RawApplication[]>("/applications/my");
  return data.map(adaptApplication);
}

export async function hasApplied(vacancyId: string): Promise<boolean> {
  const myApplications = await getMyApplications();
  return myApplications.some((app) => app.vacancyId === vacancyId);
}

export async function applyToVacancy(
  vacancyId: string,
  resumeFile: File | null,
): Promise<Application> {
  const formData = new FormData();
  formData.append("vacancy_id", vacancyId);
  if (resumeFile) {
    formData.append("resume", resumeFile);
  }

  const data = await apiFetch<RawApplication>("/applications", {
    method: "POST",
    body: formData,
  });
  return adaptApplication(data);
}

export async function cancelApplication(vacancyId: string): Promise<void> {
  await apiFetch<void>(`/applications/${vacancyId}`, { method: "DELETE" });
}

export async function getEmployerApplications(): Promise<
  EmployerApplication[]
> {
  const data = await apiFetch<RawEmployerApplication[]>(
    "/applications/employer",
  );
  return data.map(adaptEmployerApplication);
}

export async function updateApplicationStatus(
  applicationId: string,
  status: EmployerApplication["status"],
): Promise<EmployerApplication> {
  const data = await apiFetch<RawEmployerApplication>(
    `/applications/${applicationId}/status`,
    { method: "PATCH", json: { status } },
  );
  return adaptEmployerApplication(data);
}
