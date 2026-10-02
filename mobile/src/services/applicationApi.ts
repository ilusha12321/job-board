import { apiFetch, API_URL, ApiError } from "./apiClient";
import {
  type Application,
  type RawApplication,
  type EmployerApplication,
  type RawEmployerApplication,
} from "../types/application";
import * as FileSystem from "expo-file-system/legacy";
import * as Sharing from "expo-sharing";

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
    {
      method: "PATCH",
      json: { status },
    },
  );
  return adaptEmployerApplication(data);
}

export async function downloadResume(
  applicationId: string,
  resumeName: string,
): Promise<void> {
  const response = await fetch(
    `${API_URL}/applications/${applicationId}/resume`,
  );

  if (!response.ok) {
    throw new ApiError(response.status, "Failed to download resume");
  }

  const blob = await response.blob();
  const fileUri = `${FileSystem.cacheDirectory}${resumeName}`;

  const base64 = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1]);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });

  await FileSystem.writeAsStringAsync(fileUri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(fileUri);
  }
}
