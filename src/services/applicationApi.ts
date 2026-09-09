// src/services/applicationApi.ts
import { type Application } from "../types/application";

function getApplications(): Application[] {
  const raw = localStorage.getItem("applications");
  return raw ? JSON.parse(raw) : [];
}

function saveApplications(applications: Application[]): void {
  localStorage.setItem("applications", JSON.stringify(applications));
}

export function hasApplied(userId: string, vacancyId: string): boolean {
  const applications = getApplications();
  return applications.some(
    (app) => app.userId === userId && app.vacancyId === vacancyId,
  );
}

export function applyToVacancy(
  userId: string,
  vacancyId: string,
): Application | null {
  if (hasApplied(userId, vacancyId)) {
    return null;
  }
  const applications = getApplications();
  const newApplication: Application = {
    id: Date.now().toString(),
    userId,
    vacancyId,
    appliedAt: new Date().toISOString(),
    status: "delivered",
  };
  applications.push(newApplication);
  saveApplications(applications);
  return newApplication;
}

export function cancelApplication(userId: string, vacancyId: string): boolean {
  const applications = getApplications();
  const filtered = applications.filter(
    (app) => !(app.userId === userId && app.vacancyId === vacancyId),
  );
  if (filtered.length === applications.length) {
    return false;
  }
  saveApplications(filtered);
  return true;
}

export function getMyApplications(userId: string): Application[] {
  return getApplications().filter((app) => app.userId === userId);
}
