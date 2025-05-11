import React, { useState } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaChartBar,
  FaHome,
  FaMoneyBillWave,
  FaUsers,
  FaSignOutAlt,
  FaUserCircle,
} from "react-icons/fa";

const AdminNavbar = () => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const adminName = localStorage.getItem("userName") || "Admin";

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin keluar?");
    if (confirmLogout) {
      localStorage.clear();
      navigate("/"); // ubah dari '/login' ke '/'
    }
  };

  const isActive = (path) => {
    return location.pathname.startsWith(`/admin/${path}`) ? "active" : "";
  };

  const handleNavigation = () => {
    setExpanded(false);
  };

  return (
    <Navbar
      bg="dark"
      variant="dark"
      expand="lg"
      className="admin-nav shadow fixed-top"
      expanded={expanded}
      onToggle={(value) => setExpanded(value)}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/admin/dashboard"
          onClick={handleNavigation}
          className="d-flex align-items-center"
        >
          <FaHome className="me-2" size={24} />
          <span className="fw-bold">Admin Panel</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="admin-navbar-nav" />
        <Navbar.Collapse id="admin-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/admin/dashboard"
              onClick={handleNavigation}
              className={`nav-link px-3 ${isActive("dashboard")}`}
            >
              <FaChartBar className="me-2" />
              Dashboard
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/admin/kos"
              onClick={handleNavigation}
              className={`nav-link px-3 ${isActive("kos")}`}
            >
              <FaHome className="me-2" />
              Kelola Kos
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/admin/payments"
              onClick={handleNavigation}
              className={`nav-link px-3 ${isActive("payments")}`}
            >
              <FaMoneyBillWave className="me-2" />
              Pembayaran
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/admin/users"
              onClick={handleNavigation}
              className={`nav-link px-3 ${isActive("users")}`}
            >
              <FaUsers className="me-2" />
              Pengguna
            </Nav.Link>
          </Nav>

          <Nav>
            <NavDropdown
              title={
                <span className="text-light d-flex align-items-center">
                  <FaUserCircle className="me-2" size={20} />
                  {adminName}
                </span>
              }
              id="admin-nav-dropdown"
              align="end"
              className="admin-dropdown"
            >
              <NavDropdown.Item onClick={handleLogout}>
                <FaSignOutAlt className="me-2" />
                Logout
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AdminNavbar;
