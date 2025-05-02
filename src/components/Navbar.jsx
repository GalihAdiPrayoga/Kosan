import React, { useState } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import AuthModals from "./AuthModals";
import { FaUserCircle } from "react-icons/fa";

const UserNavbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userName = localStorage.getItem("userName");

  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

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
    localStorage.removeItem("userType");
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");
    localStorage.removeItem("userName");
    navigate("/");
  };

  return (
    <>
      <Navbar
        bg="white"
        expand="lg"
        fixed="top"
        className="shadow-sm navbar-custom"
      >
        <Container fluid="lg">
          <Navbar.Brand as={Link} to="/" className="fw-bold fs-4 py-2">
            KosApp
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            {/* Changed from me-auto to mx-auto for center alignment */}
            <Nav className="mx-auto">
              <Nav.Link as={Link} to="/" className="px-3">
                Beranda
              </Nav.Link>
              <Nav.Link as={Link} to="/search" className="px-3">
                Cari Kos
              </Nav.Link>
              <Nav.Link as={Link} to="/contact" className="px-3">
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
                  <NavDropdown.Item as={Link} to="/profile">
                    <i className="bi bi-person me-2"></i>
                    Profil Saya
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/bookings">
                    <i className="bi bi-calendar-check me-2"></i>
                    Pesanan Saya
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
    </>
  );
};

export default UserNavbar;
