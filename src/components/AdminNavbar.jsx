import React, { useState } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  FaHome,
  FaChartBar,
  FaUsers,
  FaComments,
  FaMoneyBillWave,
  FaUserCircle,
  FaUser,
  FaSignOutAlt,
} from "react-icons/fa";
import EditProfileModal from "./EditProfileModal";

const AdminNavbar = () => {
  const [expanded, setExpanded] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const adminName = localStorage.getItem("userName") || "Admin";

  const handleLogout = () => {
    const confirmLogout = window.confirm("Apakah Anda yakin ingin keluar?");
    if (confirmLogout) {
      localStorage.clear();
      navigate("/user/dashboard", { replace: true }); // Change from "/" to "/user/dashboard"
    }
  };

  const isActive = (path) => {
    return location.pathname.startsWith(`/admin/${path}`) ? "active" : "";
  };

  const handleNavigation = () => {
    setExpanded(false);
  };

  return (
    <>
      <Navbar
        bg="dark"
        variant="dark"
        expand="lg"
        className="shadow fixed-top"
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
              <Nav.Link
                as={Link}
                to="/admin/feedback"
                onClick={handleNavigation}
                className={`nav-link px-3 ${isActive("feedback")}`}
              >
                <FaComments className="me-2" />
                Feedback
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
                className="px-2"
              >
                <NavDropdown.Item onClick={() => setShowEditProfile(true)}>
                  <i className="bi bi-person me-2"></i>
                  Edit Profil
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/users">
                  <i className="bi bi-people me-2"></i>
                  Kelola Pengguna
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/admin/payments">
                  <i className="bi bi-cash-stack me-2"></i>
                  Kelola Pembayaran
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

export default AdminNavbar;
