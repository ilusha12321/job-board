export interface Application {
  id: string;
  userId: string;
  vacancyId: string;
  appliedAt: string;
  status: "delivered" | "reviewed" | "invite for interview";
}
