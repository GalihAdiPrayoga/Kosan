import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

const Navigation = () => {
  const navigate = useNavigate();

  return (
    <Navbar
      bg="white"
      expand="lg"
      fixed="top"
      className="shadow-sm py-3"
      style={{ minHeight: "70px" }}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold">
          KosApp
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
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
            <NavDropdown
              title={
                <span>
                  <i className="bi bi-person-circle me-1"></i>
                  Sign In
                </span>
              }
              id="basic-nav-dropdown"
              align="end"
            >
              <NavDropdown.Item as={Link} to="/login">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Masuk
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/register">
                <i className="bi bi-person-plus me-2"></i>
                Daftar
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default Navigation;
