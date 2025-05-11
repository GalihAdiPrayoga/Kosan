import React, { useState } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaClipboardList,
  FaMoneyBillWave,
  FaSignOutAlt,
  FaUserCircle,
  FaTachometerAlt,
} from "react-icons/fa";

const PemilikNavbar = () => {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pemilikName = localStorage.getItem("userName") || "Pemilik";

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin keluar?");
    if (confirmLogout) {
      localStorage.clear();
      navigate("/");
    }
  };

  const isActive = (path) => {
    return location.pathname.startsWith(`/pemilik/${path}`) ? "active" : "";
  };

  const handleNavigation = () => {
    setExpanded(false);
  };

  return (
    <Navbar
      bg="primary"
      variant="dark"
      expand="lg"
      className="shadow fixed-top"
      expanded={expanded}
      onToggle={(value) => setExpanded(value)}
    >
      <Container>
        <Navbar.Brand
          as={Link}
          to="/pemilik/dashboard"
          onClick={handleNavigation}
          className="d-flex align-items-center"
        >
          <FaHome className="me-2" size={24} />
          <span className="fw-bold">Panel Pemilik</span>
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="pemilik-navbar-nav" />
        <Navbar.Collapse id="pemilik-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link
              as={Link}
              to="/pemilik/dashboard"
              onClick={handleNavigation}
              className={`nav-link px-3 ${isActive("dashboard")}`}
            >
              <FaTachometerAlt className="me-2" />
              Dashboard
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/pemilik/kos"
              onClick={handleNavigation}
              className={`nav-link px-3 ${isActive("kos")}`}
            >
              <FaHome className="me-2" />
              Kelola Kos
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/pemilik/bookings"
              onClick={handleNavigation}
              className={`nav-link px-3 ${isActive("bookings")}`}
            >
              <FaClipboardList className="me-2" />
              Pemesanan
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/pemilik/payments"
              onClick={handleNavigation}
              className={`nav-link px-3 ${isActive("payments")}`}
            >
              <FaMoneyBillWave className="me-2" />
              Pembayaran
            </Nav.Link>
          </Nav>

          <Nav>
            <NavDropdown
              title={
                <span className="text-light d-flex align-items-center">
                  <FaUserCircle className="me-2" size={20} />
                  {pemilikName}
                </span>
              }
              id="pemilik-nav-dropdown"
              align="end"
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

export default PemilikNavbar;
