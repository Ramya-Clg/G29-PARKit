import { Navigate, useLocation } from "react-router-dom";

export function AdminRoute({ children }) {
  const adminToken = localStorage.getItem("adminToken");
  const location = useLocation();

  if (!adminToken) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
} 