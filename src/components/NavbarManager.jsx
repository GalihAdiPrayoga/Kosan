import React from "react";
import { useLocation } from "react-router-dom";
import UserNavbar from "./Navbar";
import AdminNavbar from "./AdminNavbar";
import PemilikNavbar from "./PemilikNavbar";

const NavbarManager = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");
  const isPemilikRoute = location.pathname.startsWith("/pemilik");
  const userType = localStorage.getItem("userType");

  if (isAdminRoute && userType === "admin") return <AdminNavbar />;
  if (isPemilikRoute && userType === "pemilik") return <PemilikNavbar />;
  return <UserNavbar />;
};

export default NavbarManager;
