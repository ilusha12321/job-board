import { type Vacancy } from "../types/vacancy";
export async function getVacancies(): Promise<Vacancy[]> {
  try {
    const response = await fetch("https://fakejobs-api.vercel.app/jobs");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}
export async function getVacanciesById(id: string): Promise<Vacancy | null> {
  try {
    const response = await fetch(`https://fakejobs-api.vercel.app/jobs/${id}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
