import { apiFetch } from "./apiClient";
import { type Application, type RawApplication } from "../types/application";

function adaptApplication(raw: RawApplication): Application {
  return {
    id: raw.id,
    userId: raw.user_id,
    vacancyId: raw.vacancy_id,
    appliedAt: raw.created_at,
    status: raw.status,
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

export type ResumeFile = {
  uri: string;
  name: string;
  mimeType: string;
};

export async function applyToVacancy(
  vacancyId: string,
  resumeFile: ResumeFile | null,
): Promise<Application> {
  let data: RawApplication;

  if (resumeFile) {
    const fileResponse = await fetch(resumeFile.uri);
    const rawBlob = await fileResponse.blob();
    const blob = new Blob([rawBlob], { type: resumeFile.mimeType });

    const formData = new FormData();
    formData.append("vacancy_id", vacancyId);
    formData.append("resume", blob, resumeFile.name);

    data = await apiFetch<RawApplication>("/applications", {
      method: "POST",
      body: formData,
    });
  } else {
    data = await apiFetch<RawApplication>("/applications", {
      method: "POST",
      json: { vacancy_id: vacancyId },
    });
  }

  return adaptApplication(data);
}
export async function cancelApplication(vacancyId: string): Promise<void> {
  await apiFetch<void>(`/applications/${vacancyId}`, { method: "DELETE" });
}
