import { Navigate, useLocation } from "react-router-dom";

export function SecurityRoute({ children }) {
  const securityToken = localStorage.getItem("securityToken");
  const location = useLocation();

  if (!securityToken) {
    return <Navigate to="/security/login" state={{ from: location }} replace />;
  }

  return children;
}
