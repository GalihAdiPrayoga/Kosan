import React from 'react';
import { useLocation } from 'react-router-dom';
import UserNavbar from './Navbar';

const NavbarManager = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Don't show navbar on admin routes
  if (isAdminRoute) {
    return null;
  }

  return <UserNavbar />;
};

export default NavbarManager;