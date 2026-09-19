export interface Vacancy {
  id: string;
  title: string;
  type: string;
  location: string;
  description: string;
  salary: string;
  company: Company;
  createdBy: string;
}
export interface Company {
  name: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
}

export interface RawVacancy {
  id: string;
  title: string;
  type: string;
  location: string;
  description: string;
  salary: string | null;
  company_name: string;
  company_description: string | null;
  company_contact_email: string;
  company_contact_phone: string | null;
  created_by: string;
  created_at: string;
}
export interface RawVacancyInput {
  title: string;
  type: string;
  location: string;
  description: string;
  salary: string;
  company_name: string;
  company_description: string;
  company_contact_email: string;
  company_contact_phone: string;
}
export interface RawMyVacancy extends RawVacancy {
  applications_count: number;
  new_count: number;
}

export interface MyVacancy extends Vacancy {
  applicationsCount: number;
  newCount: number;
}
