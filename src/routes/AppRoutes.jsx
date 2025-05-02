import { Routes, Route } from "react-router-dom";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import Login from "../pages/Auth/Login";
import Register from "../pages/Auth/Register";
import NavbarManager from "../components/NavbarManager";

const AppRoutes = () => {
  return (
    <>
      <NavbarManager />
      <Routes>
        {/* User Routes */}
        {UserRoutes}

        {/* Admin Routes */}
        {AdminRoutes}

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </>
  );
};

export default AppRoutes;
