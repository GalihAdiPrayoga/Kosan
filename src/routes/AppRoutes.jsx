import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import PemilikRoutes from "./PemilikRoutes";
import NavbarManager from "../components/NavbarManager";
import PaymentsAdmin from "../pages/admin/PaymentsAdmin";
import PaymentHistory from "../pages/User/PesananHistory";
import ProtectedRoute from "../components/ProtectedRoute";

// Tambahkan komponen redirect dinamis
const RootRedirect = () => {
  const userType = localStorage.getItem("userType");
  if (userType === "admin") return <Navigate to="/admin/dashboard" replace />;
  if (userType === "pemilik")
    return <Navigate to="/pemilik/dashboard" replace />;
  return <Navigate to="/user/dashboard" replace />;
};

const AppRoutes = () => {
  return (
    <>
      <NavbarManager />
      <Routes>
        {/* Redirect root path ke dashboard sesuai role */}
        <Route path="/" element={<RootRedirect />} />

        {/* User Routes */}
        {UserRoutes}

        {/* Admin Routes */}
        {AdminRoutes}

        {PemilikRoutes}

        <Route
          path="/admin/payments"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <PaymentsAdmin />
            </ProtectedRoute>
          }
        />

        <Route
          path="/pemilik/payments"
          element={
            <ProtectedRoute allowedRoles={["pemilik"]}>
              <PaymentHistory />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default AppRoutes;
