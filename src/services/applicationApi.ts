import {
  type Application,
  type RawApplication,
  type EmployerApplication,
  type RawEmployerApplication,
} from "../types/application";
const API_URL = "http://localhost:3000/api/applications";

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

export async function hasApplied(vacancyId: string): Promise<boolean> {
  const myApplications = await getMyApplications();
  return myApplications.some((app) => app.vacancyId === vacancyId);
}

export async function applyToVacancy(
  vacancyId: string,
  resumeFile: File | null,
): Promise<Application | null> {
  try {
    const formData = new FormData();
    formData.append("vacancy_id", vacancyId);
    if (resumeFile) {
      formData.append("resume", resumeFile);
    }

    const response = await fetch(API_URL, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    if (!response.ok) {
      return null;
    }

    const data: RawApplication = await response.json();
    return adaptApplication(data);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function cancelApplication(vacancyId: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_URL}/${vacancyId}`, {
      method: "DELETE",
      credentials: "include",
    });

    return response.ok;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export async function getMyApplications(): Promise<Application[]> {
  try {
    const response = await fetch(`${API_URL}/my`, {
      credentials: "include",
    });

    if (!response.ok) {
      return [];
    }

    const data: RawApplication[] = await response.json();
    return data.map((item) => adaptApplication(item));
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function getEmployerApplications(): Promise<
  EmployerApplication[]
> {
  try {
    const response = await fetch(`${API_URL}/employer`, {
      credentials: "include",
    });

    if (!response.ok) {
      return [];
    }

    const data: RawEmployerApplication[] = await response.json();
    return data.map((item) => adaptEmployerApplication(item));
  } catch (error) {
    console.error(error);
    return [];
  }
}
