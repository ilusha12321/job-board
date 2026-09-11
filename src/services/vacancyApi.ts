import { type Vacancy } from "../types/vacancy";

export async function getVacancies(): Promise<Vacancy[] | null> {
  try {
    const response = await fetch("https://fakejobs-api.vercel.app/jobs");
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function getVacanciesById(id: string): Promise<Vacancy | null> {
  try {
    const response = await fetch(`https://fakejobs-api.vercel.app/jobs/${id}`);
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createVacancy(
  newVacancy: Omit<Vacancy, "id">,
): Promise<Vacancy | null> {
  try {
    const post = await fetch("https://fakejobs-api.vercel.app/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newVacancy),
    });
    if (!post.ok) {
      return null;
    }
    const data = await post.json();
    return data.job;
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function updateVacancy(
  id: string,
  updatedVacancy: Omit<Vacancy, "id">,
): Promise<Vacancy | null> {
  try {
    const update = await fetch(`https://fakejobs-api.vercel.app/jobs/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedVacancy),
    });
    if (!update.ok) {
      return null;
    }
    const data = await update.json();
    return data.job;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function deleteVacancy(id: string): Promise<boolean> {
  try {
    const deleteById = await fetch(
      `https://fakejobs-api.vercel.app/jobs/${id}`,
      { method: "DELETE" },
    );
    if (!deleteById.ok) {
      return false;
    } else return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
