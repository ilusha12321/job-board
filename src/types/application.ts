export interface Application {
  id: string;
  userId: string;
  vacancyId: string;
  appliedAt: string;
  status: "delivered" | "reviewed" | "invite for interview";
}

export interface EmployerApplication {
  id: string;
  vacancyId: string;
  vacancyTitle: string;
  applicantUsername: string;
  applicantEmail: string;
  appliedAt: string;
  status: "delivered" | "reviewed" | "invite for interview";
  resumeName: string | null;
}
export interface RawApplication {
  id: string;
  user_id: string;
  vacancy_id: string;
  status: "delivered" | "reviewed" | "invite for interview";
  resume_name: string | null;
  resume_path: string | null;
  resume_size: number | null;
  created_at: string;
  title?: string;
  company_name?: string;
}
export interface RawEmployerApplication {
  id: string;
  user_id: string;
  username: string;
  email: string;
  vacancy_id: string;
  status: "delivered" | "reviewed" | "invite for interview";
  resume_name: string | null;
  resume_path: string | null;
  resume_size: number | null;
  created_at: string;
  title: string;
}
