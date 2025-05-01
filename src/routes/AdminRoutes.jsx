import { Route, Navigate } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import DashboardAdmin from "../pages/Admin/DashboardAdmin";
import ItemListAdmin from "../pages/Admin/ItemListAdmin";
import AddKosAdmin from "../pages/Admin/AddKosAdmin";
import EditKosAdmin from "../pages/Admin/EditKosAdmin";
import PaymentsAdmin from "../pages/Admin/PaymentsAdmin";
import ManageUsers from "../pages/Admin/ManageUsers";

const AdminRoutes = [
  <Route key="admin" path="/admin" element={<AdminLayout />}>
    <Route index element={<Navigate to="/admin/dashboard" replace />} />
    <Route path="dashboard" element={<DashboardAdmin />} />
    <Route path="kos" element={<ItemListAdmin />} />
    <Route path="kos/add" element={<AddKosAdmin />} />
    <Route path="kos/edit/:id" element={<EditKosAdmin />} />
    <Route path="payments" element={<PaymentsAdmin />} />
    <Route path="users" element={<ManageUsers />} />
  </Route>,
];

export default AdminRoutes;
