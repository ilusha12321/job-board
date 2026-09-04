export interface Vacancy {
  id: string;
  title: string;
  type: string;
  location: string;
  description: string;
  salary: string;
  company: Company;
}
export interface Company {
  name: string;
  description: string;
  contactEmail: string;
  contactPhone: string;
}
