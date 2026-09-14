import {
  type RawVacancy,
  type RawVacancyInput,
  type Vacancy,
} from "../types/vacancy";

export async function getVacancies(): Promise<Vacancy[] | null> {
  try {
    const response = await fetch("http://localhost:3000/api/vacancies");
    if (!response.ok) {
      return null;
    }

    const data: RawVacancy[] = await response.json();
    const adaped = data.map((item) => adaptVacancy(item));
    return adaped;
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function getVacanciesById(id: string): Promise<Vacancy | null> {
  try {
    const response = await fetch(`http://localhost:3000/api/vacancies/${id}`);
    if (!response.ok) {
      return null;
    }
    const data: RawVacancy = await response.json();
    return adaptVacancy(data);
  } catch (error) {
    console.error(error);
    return null;
  }
}

export async function createVacancy(
  newVacancy: Omit<Vacancy, "id">,
): Promise<Vacancy | null> {
  try {
    const post = await fetch("http://localhost:3000/api/vacancies", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(toRawVacancy(newVacancy)),
    });
    if (!post.ok) {
      return null;
    }
    const data = await post.json();
    return adaptVacancy(data);
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
    const update = await fetch(`http://localhost:3000/api/vacancies/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(toRawVacancy(updatedVacancy)),
      credentials: "include",
    });
    if (!update.ok) {
      return null;
    }
    const data = await update.json();
    return adaptVacancy(data);
  } catch (error) {
    console.error(error);
    return null;
  }
}
export async function deleteVacancy(id: string): Promise<boolean> {
  try {
    const deleteById = await fetch(
      `http://localhost:3000/api/vacancies/${id}`,
      { method: "DELETE", credentials: "include" },
    );
    if (!deleteById.ok) {
      return false;
    } else return true;
  } catch (error) {
    console.error(error);
    return false;
  }
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
