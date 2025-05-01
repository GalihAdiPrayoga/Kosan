import React from "react";
import { Outlet, Link, useNavigate } from "react-router-dom";
import { Container, Nav, Navbar, Button } from "react-bootstrap";

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userType");
    localStorage.removeItem("isLoggedIn");
    navigate("/login");
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark" expand="lg">
        <Container>
          <Navbar.Brand as={Link} to="/admin">
            Admin Panel
          </Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse>
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/admin">
                Dashboard
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/kos">
                Kelola Kos
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/payments">
                Pembayaran
              </Nav.Link>
              <Nav.Link as={Link} to="/admin/users">
                Pengguna
              </Nav.Link>
            </Nav>
            <Button variant="outline-light" onClick={handleLogout}>
              Logout
            </Button>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container className="py-4">
        <Outlet />
      </Container>
    </div>
  );
};

export default AdminLayout;
