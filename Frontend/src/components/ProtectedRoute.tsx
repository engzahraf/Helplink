import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { ReactNode } from "react";

interface ProtectedRouteProps {
  children: ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isAuthenticated, userRole } = useAuth();
  const isAdminPage = window.location.pathname.startsWith("/admin");

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }
  if (isAdminPage && userRole !== "admin") return <Navigate to="/student-dashboard" replace />;

  return <>{children}</>;
}

export default ProtectedRoute;
