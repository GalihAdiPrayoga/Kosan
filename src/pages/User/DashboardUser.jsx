import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Alert,
  Spinner,
  Badge,
  Button,
  Form,
  Carousel,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { API, getFeaturedKos } from "../../api/config";
import heroImage from "../../assets/hero1.jpg";
import { FaShieldAlt, FaMoneyBillWave, FaMapMarkerAlt } from "react-icons/fa";

const DashboardUser = () => {
  const navigate = useNavigate();
  const [featuredKos, setFeaturedKos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    fetchFeaturedKos();
  }, [retryCount]);

  const fetchFeaturedKos = async () => {
    try {
      setLoading(true);
      setError(null);
      const kosData = await getFeaturedKos();
      setFeaturedKos(kosData);
    } catch (err) {
      setError(err.message || "Gagal memuat data kos");
      console.error("Error fetching featured kos:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setRetryCount((prev) => prev + 1);
  };

  const handleSearchClick = () => {
    navigate("/search");
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
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
          <div className="d-flex justify-content-end">
            <Button onClick={handleRetry} variant="outline-danger">
              Coba Lagi
            </Button>
          </div>
        </Alert>
      </Container>
    );
  }

  const heroSlides = [
    {
      image: heroImage,
      title: "Temukan Kos Impianmu",
      description:
        "Berbagai pilihan kos dengan fasilitas terbaik untuk kenyamanan Anda",
    },
    {
      image: heroImage,
      title: "Lokasi Strategis",
      description: "Dekat dengan kampus dan pusat kota",
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Hero Carousel Section */}
      <Carousel fade interval={3000} indicators={false}>
        {heroSlides.map((slide, index) => (
          <Carousel.Item key={index}>
            <div
              style={{
                backgroundImage: `url(${slide.image})`,
                backgroundSize: "cover", 
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                backgroundColor: "#f8f9fa",
                height: "100vh",
                width: "100%",
                marginTop: "0", 
              }}
            />
          </Carousel.Item>
        ))}
      </Carousel>

      {/* Search Section */}
      <Container>
        <div
          className="bg-white shadow rounded p-4 mx-auto"
          style={{
            marginTop: "-3rem",
            maxWidth: "800px",
            position: "relative",
            zIndex: 10,
          }}
        >
          <div className="d-flex flex-column flex-md-row gap-3 align-items-center">
            <Form.Control
              type="text"
              placeholder="Cari kos berdasarkan lokasi..."
              className="flex-grow-1"
              onClick={handleSearchClick}
              style={{ cursor: "pointer" }}
            />
            <Link to="/search">
              <Button variant="primary" className="px-4 py-2 text-nowrap">
                Cari Kos
              </Button>
            </Link>
          </div>
        </div>
      </Container>

      {/* Featured Kos Section */}
      <Container className="py-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">Kos Populer</h2>
          <Button
            as={Link}
            to="/search"
            variant="outline-primary"
            className="d-flex align-items-center gap-2"
          >
            Lihat Semua
            <i className="bi bi-arrow-right"></i>
          </Button>
        </div>

        <Row>
          {featuredKos.map((kos) => (
            <Col md={4} key={kos.id} className="mb-4">
              <Card
                as={Link}
                to={`/kos/${kos.id}`}
                className="text-decoration-none h-100 shadow-sm hover-shadow border-0"
                style={{
                  cursor: "pointer",
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow =
                    "0 .5rem 1rem rgba(0,0,0,.15)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow =
                    "0 .125rem .25rem rgba(0,0,0,.075)";
                }}
              >
                <div style={{ position: "relative" }}>
                  <Card.Img
                    variant="top"
                    src={kos.images[0]}
                    style={{ height: "200px", objectFit: "cover" }}
                  />
                  <Badge
                    bg={
                      kos.type === "Putra"
                        ? "primary"
                        : kos.type === "Putri"
                        ? "danger"
                        : "success"
                    }
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      padding: "8px 12px",
                    }}
                  >
                    {kos.type}
                  </Badge>
                </div>
                <Card.Body>
                  <Card.Title className="h5 mb-3">{kos.name}</Card.Title>
                  <Card.Text className="text-muted mb-2">
                    <i className="bi bi-geo-alt-fill me-2"></i>
                    {kos.location}
                  </Card.Text>
                  <div className="mb-2">
                    {kos.facilities.slice(0, 3).map((facility, index) => (
                      <Badge
                        bg="light"
                        text="dark"
                        className="me-2 mb-2"
                        key={index}
                      >
                        {facility}
                      </Badge>
                    ))}
                  </div>
                  <div className="mt-3">
                    <span className="h5 text-primary mb-0">
                      Rp {new Intl.NumberFormat("id-ID").format(kos.price)}
                    </span>
                    <span className="text-muted">/bulan</span>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>

      {/* Features Section */}
      <div className="bg-light py-5">
        <Container>
          <h2 className="text-center mb-5">Mengapa Memilih Kami?</h2>
          <Row className="g-4 justify-content-center">
            {[
              {
                icon: <FaShieldAlt size={32} />,
                title: "Terpercaya",
                description: "Semua kos telah diverifikasi tim kami",
              },
              {
                icon: <FaMoneyBillWave size={32} />,
                title: "Harga Terjangkau",
                description: "Berbagai pilihan harga sesuai budget",
              },
              {
                icon: <FaMapMarkerAlt size={32} />,
                title: "Lokasi Strategis",
                description: "Dekat dengan kampus dan pusat kota",
              },
            ].map((feature, index) => (
              <Col md={4} key={index} className="text-center">
                <div className="feature-card p-4">
                  <div className="feature-icon text-primary mb-4">
                    {feature.icon}
                  </div>
                  <h4 className="mb-3">{feature.title}</h4>
                  <p className="text-muted mb-0">{feature.description}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default DashboardUser;
