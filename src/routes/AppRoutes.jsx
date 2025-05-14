import React from "react";
import { Routes, Route } from "react-router-dom";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import PemilikRoutes from "./PemilikRoutes";
import NavbarManager from "../components/NavbarManager";
import PaymentsAdmin from "../pages/admin/PaymentsAdmin";
import PaymentHistory from "../pages/User/PesananHistory";
import ProtectedRoute from "../components/ProtectedRoute";

const AppRoutes = () => {
  return (
    <>
      <NavbarManager />
      <Routes>
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
