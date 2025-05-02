import { Route, Navigate, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import DashboardAdmin from "../pages/Admin/DashboardAdmin";
import ItemListAdmin from "../pages/Admin/ItemListAdmin";
import AddKosAdmin from "../pages/Admin/AddKosAdmin";
import EditKosAdmin from "../pages/Admin/EditKosAdmin";
import PaymentsAdmin from "../pages/Admin/PaymentsAdmin";
import ManageUsers from "../pages/Admin/ManageUsers";
import AdminNavbar from "../components/AdminNavbar";

// Define AdminGuard component first
const AdminGuard = ({ children }) => {
  const userType = localStorage.getItem("userType");
  const isAdmin = localStorage.getItem("isAdmin") === "true";
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      console.log("Admin access denied - clearing session");
      localStorage.clear();
      navigate("/login", {
        replace: true,
        state: {
          message: "Anda harus login sebagai admin untuk mengakses halaman ini",
        },
      });
    }
  }, [isLoggedIn, isAdmin, navigate]);

  if (!isLoggedIn || !isAdmin) {
    return null;
  }

  return children;
};

// Create AdminLayout component
const AdminLayout = () => {
  return (
    <>
      <AdminNavbar />
      <div className="admin-layout">
        <div className="admin-content container py-4">
          <Outlet />
        </div>
      </div>
    </>
  );
};

const AdminRoutes = [
  <Route
    key="admin"
    path="/admin"
    element={
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    }
  >
    <Route index element={<Navigate to="dashboard" replace />} />
    <Route path="dashboard" element={<DashboardAdmin />} />
    <Route path="kos" element={<ItemListAdmin />} />
    <Route path="kos/add" element={<AddKosAdmin />} />
    <Route path="kos/edit/:id" element={<EditKosAdmin />} />
    <Route path="payments" element={<PaymentsAdmin />} />
    <Route path="users" element={<ManageUsers />} />
  </Route>,
];

export default AdminRoutes;
