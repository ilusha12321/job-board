export interface Application {
  id: string;
  userId: string;
  vacancyId: string;
  appliedAt: string;
  status: "delivered" | "reviewed" | "invite for interview";
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
