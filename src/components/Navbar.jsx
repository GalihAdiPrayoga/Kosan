import React from 'react';
import { Navbar, Container, Nav, NavDropdown, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const UserNavbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userName = localStorage.getItem('userName');

  const handleLogout = () => {
    localStorage.removeItem('userType');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    navigate('/login');
  };

  return (
    <Navbar bg="white" expand="lg" fixed="top" className="shadow-sm py-3">
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          KosApp
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="user-navbar-nav" />
        <Navbar.Collapse id="user-navbar-nav">
          <Nav className="mx-auto">
            <Nav.Link as={Link} to="/" className="mx-2">
              Beranda
            </Nav.Link>
            <Nav.Link as={Link} to="/search" className="mx-2">
              Cari Kos
            </Nav.Link>
            <Nav.Link as={Link} to="/about" className="mx-2">
              Tentang Kami
            </Nav.Link>
          </Nav>
          <Nav>
            {isLoggedIn ? (
              <NavDropdown 
                title={
                  <span>
                    <i className="bi bi-person-circle me-1"></i>
                    {userName}
                  </span>
                }
                id="user-dropdown"
                align="end"
              >
                <NavDropdown.Item as={Link} to="/profile">
                  <i className="bi bi-person me-2"></i>
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/bookings">
                  <i className="bi bi-calendar-check me-2"></i>
                  My Bookings
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <div className="d-flex gap-2">
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="outline-primary"
                >
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/register" 
                  variant="primary"
                >
                  Register
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default UserNavbar;
