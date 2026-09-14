import { type Application, type RawApplication } from "../types/application";

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

export async function hasApplied(vacancyId: string): Promise<boolean> {
  const myApplications = await getMyApplications();
  return myApplications.some((app) => app.vacancyId === vacancyId);
}

export async function applyToVacancy(
  vacancyId: string,
): Promise<Application | null> {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ vacancy_id: vacancyId }),
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
