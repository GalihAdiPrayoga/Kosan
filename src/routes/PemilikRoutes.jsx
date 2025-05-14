// src/routes/PemilikRoutes.jsx
import { Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";
import PemilikDashboard from "../pages/Pemilik/PemilikDashboard";
import ManageKos from "../pages/Pemilik/ManageKos";
import AddKos from "../pages/Pemilik/AddKos";
import EditKos from "../pages/Pemilik/EditKos";
import BookingList from "../pages/Pemilik/BookingList";


const PemilikRoutes = [
  <Route
    key="pemilik-dashboard"
    path="/pemilik/dashboard"
    element={
      <ProtectedRoute allowedRoles={["pemilik"]}>
        <PemilikDashboard />
      </ProtectedRoute>
    }
  />,
  <Route
    key="manage-kos"
    path="/pemilik/kos"
    element={
      <ProtectedRoute allowedRoles={["pemilik"]}>
        <ManageKos />
      </ProtectedRoute>
    }
  />,
  <Route
    key="add-kos"
    path="/pemilik/kos/add"
    element={
      <ProtectedRoute allowedRoles={["pemilik"]}>
        <AddKos />
      </ProtectedRoute>
    }
  />,
  <Route
    key="edit-kos"
    path="/pemilik/kos/edit/:id"
    element={
      <ProtectedRoute allowedRoles={["pemilik"]}>
        <EditKos />
      </ProtectedRoute>
    }
  />,
  <Route
    key="bookings"
    path="/pemilik/bookings"
    element={
      <ProtectedRoute allowedRoles={["pemilik"]}>
        <BookingList />
      </ProtectedRoute>
    }
  />,

];

export default PemilikRoutes;
