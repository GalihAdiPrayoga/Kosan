import React, { useState } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
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

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Anda akan keluar dari akun ini",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, keluar!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      localStorage.clear();
      navigate("/user/dashboard", { replace: true });
      Swal.fire("Berhasil Keluar!", "Anda telah keluar dari akun.", "success");
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
        className="shadow-sm fixed-top navbar-pemilik"
        expanded={expanded}
        onToggle={(value) => setExpanded(value)}
        style={{
          background: "rgba(13, 110, 253, 0.95)",
          backdropFilter: "blur(10px)",
        }}
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
                  <div className="d-flex align-items-center">
                    <FaUser className="me-2" />
                    <span>Edit Profil</span>
                  </div>
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/pemilik/kos">
                  <div className="d-flex align-items-center">
                    <FaHome className="me-2" />
                    <span>Kelola Kos</span>
                  </div>
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/pemilik/bookings">
                  <div className="d-flex align-items-center">
                    <FaClipboardList className="me-2" />
                    <span>Pesanan</span>
                  </div>
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <div className="d-flex align-items-center">
                    <FaSignOutAlt className="me-2" />
                    <span>Keluar</span>
                  </div>
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
