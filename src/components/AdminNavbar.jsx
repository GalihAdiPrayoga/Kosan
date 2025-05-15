import React, { useState } from "react";
import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
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
import Swal from "sweetalert2";

const AdminNavbar = () => {
  const [expanded, setExpanded] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const adminName = localStorage.getItem("userName") || "Admin";

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
    return location.pathname.startsWith(`/admin/${path}`) ? "active" : "";
  };

  const handleNavigation = () => {
    setExpanded(false);
  };

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const linkVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 },
  };

  return (
    <>
      <motion.div initial="hidden" animate="visible" variants={navVariants}>
        <Navbar
          bg="dark"
          variant="dark"
          expand="lg"
          className="shadow-sm fixed-top navbar-admin"
          expanded={expanded}
          onToggle={(value) => setExpanded(value)}
          style={{
            background: "rgba(33, 37, 41, 0.95)",
            backdropFilter: "blur(10px)",
          }}
        >
          <Container>
            <motion.div
              whileHover="hover"
              whileTap="tap"
              variants={linkVariants}
            >
              <Navbar.Brand
                as={Link}
                to="/admin/dashboard"
                onClick={handleNavigation}
                className="d-flex align-items-center hover:opacity-80 transition-opacity"
              >
                <FaHome
                  className="me-2 transform transition-transform"
                  size={24}
                />
                <span className="fw-bold">Admin Panel</span>
              </Navbar.Brand>
            </motion.div>

            <Navbar.Toggle aria-controls="admin-navbar-nav" />
            <Navbar.Collapse id="admin-navbar-nav">
              <Nav className="me-auto">
                {[
                  { path: "dashboard", icon: FaChartBar, label: "Dashboard" },
                  { path: "kos", icon: FaHome, label: "Kelola Kos" },
                  {
                    path: "payments",
                    icon: FaMoneyBillWave,
                    label: "Pembayaran",
                  },
                  { path: "users", icon: FaUsers, label: "Pengguna" },
                  { path: "feedback", icon: FaComments, label: "Feedback" },
                ].map(({ path, icon: Icon, label }) => (
                  <motion.div
                    key={path}
                    whileHover="hover"
                    whileTap="tap"
                    variants={linkVariants}
                  >
                    <Nav.Link
                      as={Link}
                      to={`/admin/${path}`}
                      onClick={handleNavigation}
                      className={`nav-link px-3 hover:bg-gray-800 hover:text-gray-200 rounded-md transition-all duration-200 ${
                        isActive(path)
                          ? "bg-gray-700 text-white"
                          : "text-gray-300"
                      }`}
                    >
                      <Icon className="me-2 transform transition-transform" />
                      {label}
                    </Nav.Link>
                  </motion.div>
                ))}
              </Nav>

              <Nav>
                <NavDropdown
                  title={
                    <motion.span
                      whileHover={{ scale: 1.05 }}
                      className="text-light d-flex align-items-center"
                    >
                      <FaUserCircle className="me-2" size={20} />
                      {adminName}
                    </motion.span>
                  }
                  id="admin-nav-dropdown"
                  align="end"
                  className="px-2 hover:bg-transparent"
                >
                  <NavDropdown.Item
                    onClick={() => setShowEditProfile(true)}
                    className="hover:bg-gray-100 transition-colors duration-200"
                  >
                    <FaUser className="me-2" />
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
                  <NavDropdown.Item
                    onClick={handleLogout}
                    className="hover:bg-gray-100 transition-colors duration-200"
                  >
                    <FaSignOutAlt className="me-2" />
                    Keluar
                  </NavDropdown.Item>
                </NavDropdown>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      </motion.div>

      <EditProfileModal
        show={showEditProfile}
        handleClose={() => setShowEditProfile(false)}
      />
    </>
  );
};

export default AdminNavbar;
