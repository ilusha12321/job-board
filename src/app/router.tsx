import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import VacanciesPage from "../pages/VacanciesPage";
import Layout from "../components/Layout";
import VacancyDetailsPage from "../pages/VacancyDetailsPage";
import RegisterPage from "../pages/RegisterPage";
import LoginPage from "../pages/LoginPage";
import ProtectedRoute from "./ProtectedRoute";
import CreateVacancyPage from "../pages/CreateVacancyPage";
import EditVacancyPage from "../pages/EditVacancyPage";
import MyApplicationsPage from "../pages/MyApplicationsPage";
import EmployerApplicationsPage from "../pages/EmployerApplicationsPage";
import MyVacanciesPage from "../pages/MyVacanciesPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "vacancies", element: <VacanciesPage /> },
      { path: "vacancies/:id", element: <VacancyDetailsPage /> },
      { path: "register", element: <RegisterPage /> },
      { path: "login", element: <LoginPage /> },
      {
        element: <ProtectedRoute requiredRole="employer" />,
        children: [
          { path: "create-vacancy", element: <CreateVacancyPage /> },
          { path: "edit-vacancy/:id", element: <EditVacancyPage /> },
          {
            path: "employer-applications",
            element: <EmployerApplicationsPage />,
          },
          { path: "my-vacancies", element: <MyVacanciesPage /> },
        ],
      },
      {
        element: <ProtectedRoute requiredRole="jobseeker" />,
        children: [
          { path: "my-applications", element: <MyApplicationsPage /> },
        ],
      },
    ],
  },
]);
export default router;
