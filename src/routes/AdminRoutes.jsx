// src/routes/AdminRoutes.jsx
import { Route, Navigate, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardAdmin from "../pages/Admin/DashboardAdmin";
import ItemListAdmin from "../pages/admin/ItemListAdmin";
import DetailKosAdmin from "../pages/admin/DetailkosAdmin"; // Fix import name
import PaymentsAdmin from "../pages/Admin/PaymentsAdmin";
import ManageUsers from "../pages/admin/ManageUsers";
import AdminNavbar from "../components/AdminNavbar";

// Reusable ProtectedRoute like PemilikRoutes
const ProtectedRoute = ({ allowedRoles, children }) => {
  const [checked, setChecked] = useState(false);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const userType = localStorage.getItem("userType");

    console.log("ProtectedRoute check:", { isLoggedIn, userType });

    if (isLoggedIn && allowedRoles.includes(userType)) {
      setAuthorized(true);
    } else {
      localStorage.removeItem("token");
      localStorage.removeItem("isLoggedIn");
    }

    setChecked(true);
  }, []);

  if (!checked) return null;

  if (!authorized) {
    return (
      <Navigate
        to="/login"
        state={{ message: "Akses ditolak. Silakan login sebagai admin." }}
        replace
      />
    );
  }

  return children;
};

const AdminLayout = () => (
  <>
    <AdminNavbar />
    <div className="admin-layout">
      <div className="admin-content container py-4">
        <Outlet />
      </div>
    </div>
  </>
);

const AdminRoutes = [
  <Route
    key="admin"
    path="/admin"
    element={
      <ProtectedRoute allowedRoles={["admin"]}>
        <AdminLayout />
      </ProtectedRoute>
    }
  >
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<DashboardAdmin />} />
    <Route path="kos" element={<ItemListAdmin />} />
    <Route path="kos/detail/:id" element={<DetailKosAdmin />} />{" "}
    {/* Fix route path and component */}
    <Route path="payments" element={<PaymentsAdmin />} />
    <Route path="users" element={<ManageUsers />} />
  </Route>,
];

export default AdminRoutes;
