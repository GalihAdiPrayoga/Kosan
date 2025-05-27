// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const location = useLocation();

  if (!isLoggedIn) {
    // Simpan halaman yang dicoba diakses
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  return children;
};

export default ProtectedRoute;
