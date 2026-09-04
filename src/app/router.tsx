import { createBrowserRouter } from "react-router-dom";
import HomePage from "../pages/HomePage";
import VacanciesPage from "../pages/VacanciesPage";
import Layout from "../components/Layout";
import VacancyDetailsPage from "../pages/VacancyDetailsPage";
import RegisterPage from "../pages/RegisterPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "vacancies", element: <VacanciesPage /> },
      { path: "vacancies/:id", element: <VacancyDetailsPage /> },
      { path: "register", element: <RegisterPage /> },
    ],
  },
]);
export default router;
