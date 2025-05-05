import { Route, Navigate } from "react-router-dom";
import PemilikDashboard from "../pages/Pemilik/PemilikDashboard";
import ManageKos from "../pages/Pemilik/ManageKos";
import AddKos from "../pages/Pemilik/AddKos";
import EditKos from "../pages/Pemilik/EditKos";
import BookingList from "../pages/Pemilik/BookingList";


const PemilikGuard = ({ children }) => {
  const userType = localStorage.getItem("userType");
  const isPemilik = localStorage.getItem("isPemilik") === "true";

  if (!isPemilik || userType !== "pemilik") {
    return <Navigate to="/login" />;
  }

  return children;
};

const PemilikRoutes = [
  <Route
    key="pemilik-dashboard"
    path="/pemilik/dashboard"
    element={
      <PemilikGuard>
        <PemilikDashboard />
      </PemilikGuard>
    }
  />,
  <Route
    key="pemilik-kos"
    path="/pemilik/kos"
    element={
      <PemilikGuard>
        <ManageKos />
      </PemilikGuard>
    }
  />,
  <Route
    key="pemilik-kos-add"
    path="/pemilik/kos/add"
    element={
      <PemilikGuard>
        <AddKos />
      </PemilikGuard>
    }
  />,
  <Route
    key="pemilik-kos-edit"
    path="/pemilik/kos/edit/:id"
    element={
      <PemilikGuard>
        <EditKos />
      </PemilikGuard>
    }
  />,
  <Route
    key="pemilik-bookings"
    path="/pemilik/bookings"
    element={
      <PemilikGuard>
        <BookingList />
      </PemilikGuard>
    }
  />,
 
 
];

export default PemilikRoutes;
