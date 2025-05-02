import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Carousel,
  Alert,
  Badge,
} from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import { API } from "../../api/config";
import AuthModals from "../../components/AuthModals";

const DetailKosUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kos, setKos] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  useEffect(() => {
    fetchKosDetail();
  }, [id]);

  const fetchKosDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.get("/db.json");
      const kosData = response.data.kos.find((k) => k.id === id);

      if (!kosData) {
        throw new Error("Kos not found");
      }

      // Find admin data
      const adminData = response.data.users.find(
        (user) => user.id === String(kosData.adminId) && user.role === "admin"
      );

      setKos(kosData);
      setAdmin(adminData);
    } catch (err) {
      setError(err.message || "Failed to fetch kos detail");
    } finally {
      setLoading(false);
    }
  };

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

  const handleBookingClick = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    navigate(`/booking/${kos.id}`);
  };

  if (loading) {
    return (
      <Container className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Error</Alert.Heading>
          <p>{error}</p>
          <hr />
          <Link to="/search" className="btn btn-outline-danger">
            Back to Search
          </Link>
        </Alert>
      </Container>
    );
  }

  if (!kos) return <Alert variant="warning">Kos not found</Alert>;

  return (
    <>
      <Container className="py-5">
        <Row>
          <Col md={8}>
            <Card className="mb-4">
              <Carousel>
                {kos.images.map((image, index) => (
                  <Carousel.Item key={index}>
                    <img
                      className="d-block w-100"
                      src={image}
                      alt={`${kos.name} - Image ${index + 1}`}
                      style={{ height: "400px", objectFit: "cover" }}
                    />
                  </Carousel.Item>
                ))}
              </Carousel>
            </Card>

            <Card className="mb-4">
              <Card.Body>
                <h2>{kos.name}</h2>
                <p className="text-muted">
                  <i className="bi bi-geo-alt"></i> {kos.location}
                </p>
                <hr />
                <h5>Deskripsi</h5>
                <p>{kos.description}</p>
                <h5>Fasilitas</h5>
                <ul>
                  {kos.facilities.map((facility, index) => (
                    <li key={index}>{facility}</li>
                  ))}
                </ul>
                <h5>Peraturan Kos</h5>
                <ul>
                  {kos.rules.map((rule, index) => (
                    <li key={index}>{rule}</li>
                  ))}
                </ul>
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="sticky-top" style={{ top: "20px" }}>
              <Card.Body>
                <h4>Rp {new Intl.NumberFormat("id-ID").format(kos.price)}</h4>
                <p className="text-muted">per bulan</p>
                <hr />
                <p>
                  <strong>Tipe:</strong> {kos.type}
                  <br />
                  <strong>Lokasi:</strong> {kos.location}
                </p>
                <Button
                  variant="primary"
                  className="w-100 mb-3"
                  onClick={handleBookingClick}
                >
                  {isLoggedIn ? "Booking Sekarang" : "Login untuk Booking"}
                </Button>

                {!isLoggedIn && (
                  <p className="text-center text-muted small">
                    Belum punya akun?{" "}
                    <Button
                      variant="link"
                      className="p-0"
                      onClick={() => setShowRegister(true)}
                    >
                      Daftar di sini
                    </Button>
                  </p>
                )}

                {/* Admin information section */}
                {admin && (
                  <div className="mt-3 p-3 bg-light rounded">
                    <h6 className="mb-2">Informasi Pemilik Kos:</h6>
                    <p className="mb-1">
                      <strong>Nama:</strong> {admin.name}
                    </p>
                    <p className="mb-1">
                      <strong>Email:</strong> {admin.email}
                    </p>
                    <p className="mb-0">
                      <strong>Status:</strong>{" "}
                      <Badge
                        bg={admin.status === "active" ? "success" : "warning"}
                      >
                        {admin.status}
                      </Badge>
                    </p>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <AuthModals
        showLogin={showLogin}
        showRegister={showRegister}
        handleClose={handleClose}
        handleSwitch={handleSwitch}
      />
    </>
  );
};

export default DetailKosUser;
