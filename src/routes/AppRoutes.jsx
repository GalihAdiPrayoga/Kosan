import { Routes } from "react-router-dom";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
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
      </Routes>
    </>
  );
};

export default AppRoutes;
