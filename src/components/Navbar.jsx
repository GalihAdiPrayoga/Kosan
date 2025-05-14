import React, { useState } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AuthModals from "./AuthModals";
import { FaUserCircle } from "react-icons/fa";
import EditProfileModal from "./EditProfileModal";

const UserNavbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userName = localStorage.getItem("userName");

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const handleClose = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleSwitch = (type) => {
    if (type === "login") {
      setShowRegister(false);
      setShowLogin(true);
    } else {
      setShowLogin(false);
      setShowRegister(true);
    }
  };

  const handleLogout = () => {
    localStorage.clear(); // Clear all localStorage data
    navigate("/user/dashboard", { replace: true }); // Change from "/" to "/user/dashboard"
  };

  // Add this function to handle navigation
  const handleNavigation = () => {
    setExpanded(false);
  };

  return (
    <>
      <Navbar
        bg="white"
        expand="lg"
        fixed="top"
        className="shadow-sm navbar-custom"
        expanded={expanded}
        onToggle={(value) => setExpanded(value)}
      >
        <Container fluid="lg">
          <Navbar.Brand
            as={Link}
            to="/"
            onClick={handleNavigation}
            className="fw-bold fs-4 py-2"
          >
            KosApp
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto">
              <Nav.Link
                as={Link}
                to="/user/dashboard"
                onClick={handleNavigation}
                className="px-3"
              >
                Beranda
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/search"
                onClick={handleNavigation}
                className="px-3"
              >
                Cari Kos
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/contact"
                onClick={handleNavigation}
                className="px-3"
              >
                Hubungi Kami
              </Nav.Link>
            </Nav>
            {/* User dropdown remains on the right */}
            <Nav>
              {isLoggedIn ? (
                <NavDropdown
                  title={
                    <span className="d-inline-flex align-items-center">
                      <FaUserCircle className="me-2" />
                      {userName}
                    </span>
                  }
                  id="user-dropdown"
                  align="end"
                  className="px-2"
                >
                  <NavDropdown.Item onClick={() => setShowEditProfile(true)}>
                    <i className="bi bi-person me-2"></i>
                    Edit Profil
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/payment-history">
                    <i className="bi bi-receipt me-2"></i>
                    Riwayat Pembayaran
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Keluar
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <NavDropdown
                  title={
                    <span className="d-inline-flex align-items-center">
                      <FaUserCircle className="me-2" />
                      Akun Saya
                    </span>
                  }
                  id="auth-dropdown"
                  align="end"
                  className="px-2"
                >
                  <NavDropdown.Item
                    onClick={() => setShowLogin(true)}
                    className="py-2"
                  >
                    <i className="bi bi-box-arrow-in-right me-2"></i>
                    Masuk
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    onClick={() => setShowRegister(true)}
                    className="py-2"
                  >
                    <i className="bi bi-person-plus me-2"></i>
                    Daftar
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <AuthModals
        showLogin={showLogin}
        showRegister={showRegister}
        handleClose={handleClose}
        handleSwitch={handleSwitch}
      />
      <EditProfileModal
        show={showEditProfile}
        handleClose={() => setShowEditProfile(false)}
      />
    </>
  );
};

export default UserNavbar;
