import { useAuth } from "./AuthContext";

import { Navigate, Outlet } from "react-router-dom";
type ProtectedRouteProps = {
  requiredRole?: "jobseeker" | "employer";
};
export default function ProtectedRoute({ requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  if (isLoading === true) {
    return "Loading...";
  }
  if (!user) {
    return <Navigate to="/login" />;
  }
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/vacancies" />;
  }

  return <Outlet />;
}
