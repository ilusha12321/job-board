import { useState, useEffect } from "react";
import { getEmployerApplications } from "../services/applicationApi";
import type { EmployerApplication } from "../types/application";

export default function EmployerApplicationsPage() {
  const [applications, setApplications] = useState<EmployerApplication[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      const result = await getEmployerApplications();
      setApplications(result);
      setIsLoading(false);
    };
    loadData();
  }, []);

  return (
    <>
      <h1>Applications for my vacancies</h1>
      {isLoading ? (
        <p>Loading...</p>
      ) : applications.length === 0 ? (
        <p>No applications yet.</p>
      ) : (
        applications.map((app) => (
          <div key={app.id}>
            <div>Vacancy: {app.vacancyTitle}</div>
            <div>
              Applicant: {app.applicantUsername} ({app.applicantEmail})
            </div>
            <div>Status: {app.status}</div>
            <div>
              Applied: {new Date(app.appliedAt).toLocaleString("uk-UA")}
            </div>
            <div>{app.resumeName ? app.resumeName : "No resume attached"}</div>
          </div>
        ))
      )}
    </>
  );
}
