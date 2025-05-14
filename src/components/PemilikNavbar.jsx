import React, { useState } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaClipboardList,
  FaUser,
  FaSignOutAlt,
  FaUserCircle,
  FaTachometerAlt,
} from "react-icons/fa";
import EditProfileModal from "./EditProfileModal";

const PemilikNavbar = () => {
  const [expanded, setExpanded] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pemilikName = localStorage.getItem("userName") || "Pemilik";

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin keluar?");
    if (confirmLogout) {
      localStorage.clear();
      navigate("/user/dashboard", { replace: true }); // Change from "/" to "/user/dashboard"
    }
  };

  const isActive = (path) => {
    return location.pathname.startsWith(`/pemilik/${path}`) ? "active" : "";
  };

  const handleNavigation = () => {
    setExpanded(false);
  };

  return (
    <>
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
            </Nav>

            <Nav>
              <NavDropdown
                title={
                  <span className="d-inline-flex align-items-center">
                    <FaUserCircle className="me-2" size={20} />
                    {pemilikName}
                  </span>
                }
                id="pemilik-nav-dropdown"
                align="end"
                className="px-2"
              >
                <NavDropdown.Item onClick={() => setShowEditProfile(true)}>
                  <i className="bi bi-person me-2"></i>
                  Edit Profil
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/pemilik/kos">
                  <i className="bi bi-house me-2"></i>
                  Kelola Kos
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/pemilik/bookings">
                  <i className="bi bi-receipt me-2"></i>
                  Pesanan
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Keluar
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <EditProfileModal
        show={showEditProfile}
        handleClose={() => setShowEditProfile(false)}
      />
    </>
  );
};

export default PemilikNavbar;
