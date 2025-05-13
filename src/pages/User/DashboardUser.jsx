import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { FaShieldAlt, FaMoneyBillWave, FaMapMarkerAlt } from "react-icons/fa";
import { getImageUrl } from "../../utils/imageUtils";

// Import hero images
import hero1 from "../../assets/hero1.jpeg";
import hero2 from "../../assets/hero2.jpeg";
import hero3 from "../../assets/hero3.jpeg";

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

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/kosans/public`
      );

      if (response?.data?.data) {
        const transformedData = response.data.data.map((kos) => {
          // Get category from API response
          let kosType = "Campur"; // default value

          if (kos.kategori && typeof kos.kategori === "object") {
            // If kategori is an object with nama_kategori
            kosType = kos.kategori.nama_kategori;
          } else if (kos.kategori_id) {
            // If we have kategori_id but no kategori object
            switch (kos.kategori_id) {
              case 1:
                kosType = "Kos Putra";
                break;
              case 2:
                kosType = "Kos Putri";
                break;
              case 3:
                kosType = "Kos Campur";
                break;
              default:
                kosType = "Campur";
            }
          } else {
            // Fallback to name-based detection
            const kosName = kos.nama_kosan.toLowerCase();
            if (kosName.includes("putri")) {
              kosType = "Kos Putri";
            } else if (kosName.includes("putra")) {
              kosType = "Kos Putra";
            }
          }

          return {
            ...kos,
            kategori: kosType,
            galeri: Array.isArray(kos.galeri) ? kos.galeri : [kos.galeri],
            fasilitas: Array.isArray(kos.fasilitas) ? kos.fasilitas : [],
            harga_per_bulan: Number(kos.harga_per_bulan),
          };
        });

        const featuredData = transformedData.slice(0, 6);
        setFeaturedKos(featuredData);
      } else {
        throw new Error("Data tidak valid");
      }
    } catch (err) {
      console.error("Error fetching kos:", err);
      setError(err.response?.data?.message || "Gagal memuat data kos unggulan");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          {error}
          <Button
            variant="outline-danger"
            size="sm"
            className="ms-3"
            onClick={() => setRetryCount((prev) => prev + 1)}
          >
            Coba Lagi
          </Button>
        </Alert>
      </Container>
    );
  }

  const heroSlides = [
    {
      image: hero1,
      title: "Temukan Kos Impianmu",
      description:
        "Berbagai pilihan kos dengan fasilitas terbaik untuk kenyamanan Anda",
    },
    {
      image: hero2,
      title: "Lokasi Strategis",
      description: "Dekat dengan kampus dan pusat kota",
    },
    {
      image: hero3,
      title: "Harga Terjangkau",
      description: "Berbagai pilihan harga sesuai budget Anda",
    },
  ];

  return (
    <div className="dashboard-container">
      {/* Hero Carousel Section */}
      <Carousel
        fade
        interval={3000} // 3000ms = 3 detik
        indicators={true}
        controls={false}
        className="hero-carousel"
      >
        {heroSlides.map((slide, index) => (
          <Carousel.Item key={index}>
            <div
              style={{
                backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${slide.image})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                height: "50vh",
                width: "100%",
                marginTop: "0",
              }}
            >
              <Container className="h-100 d-flex align-items-center justify-content-center">
                <div className="text-white text-center">
                  <h1 className="display-4 fw-bold mb-3">{slide.title}</h1>
                  <p className="lead mb-4">{slide.description}</p>
                </div>
              </Container>
            </div>
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
              onClick={() => navigate("/search")}
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
            className="btn-gradient-primary"
            style={{ textDecoration: "none" }}
          >
            Lihat Semua
          </Button>
        </div>

        <Row>
          {featuredKos.map((kos) => (
            <Col md={4} key={kos.id} className="mb-4">
              <Card
                as={Link}
                to={`/kos/${kos.id}`}
                className="kos-card"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div style={{ position: "relative" }}>
                  <Card.Img
                    variant="top"
                    src={
                      kos.galeri?.[0]
                        ? getImageUrl(kos.galeri[0])
                        : "/images/default-kos.jpg"
                    }
                    style={{
                      height: "200px",
                      objectFit: "cover",
                      backgroundColor: "#f8f9fa",
                      borderTopLeftRadius: "0.375rem",
                      borderTopRightRadius: "0.375rem",
                    }}
                    onError={(e) => {
                      console.log("Failed to load image:", e.target.src);
                      const currentIndex = kos.galeri.findIndex(
                        (img) => getImageUrl(img) === e.target.src
                      );
                      if (
                        currentIndex >= 0 &&
                        currentIndex < kos.galeri.length - 1
                      ) {
                        e.target.src = getImageUrl(
                          kos.galeri[currentIndex + 1]
                        );
                      } else {
                        e.target.src = "/images/default-kos.jpg";
                      }
                    }}
                    alt={`${kos.nama_kosan} thumbnail`}
                  />
                  <Badge
                    bg={
                      kos.kategori?.toLowerCase().includes("putra")
                        ? "primary"
                        : kos.kategori?.toLowerCase().includes("putri")
                        ? "danger"
                        : "success"
                    }
                    style={{
                      position: "absolute",
                      top: "10px",
                      right: "10px",
                      padding: "8px 12px",
                      zIndex: 1,
                    }}
                  >
                    {kos.kategori}
                  </Badge>
                </div>
                <Card.Body>
                  <Card.Title className="h5 mb-3">{kos.nama_kosan}</Card.Title>
                  <Card.Text className="text-muted mb-2">
                    <i className="bi bi-geo-alt-fill me-2"></i>
                    {kos.alamat}
                  </Card.Text>
                  <div className="mb-2">
                    {kos.fasilitas &&
                      Array.isArray(kos.fasilitas) &&
                      kos.fasilitas.slice(0, 3).map((facility, index) => (
                        <Badge
                          bg="light"
                          text="dark"
                          className="me-2 mb-2"
                          key={index}
                        >
                          {facility.nama_fasilitas}
                        </Badge>
                      ))}
                  </div>
                  <div className="mt-3">
                    <span className="h5 text-primary mb-0">
                      Rp{" "}
                      {new Intl.NumberFormat("id-ID").format(
                        kos.harga_per_bulan
                      )}
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
