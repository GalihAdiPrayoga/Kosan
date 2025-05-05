import { Routes } from "react-router-dom";
import UserRoutes from "./UserRoutes";
import AdminRoutes from "./AdminRoutes";
import PemilikRoutes from "./PemilikRoutes";
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

        {PemilikRoutes}

      </Routes>
    </>
  );
};

export default AppRoutes;
