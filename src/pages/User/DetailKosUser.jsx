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
import { FaUserCircle, FaWhatsapp } from "react-icons/fa";

const DetailKosUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [kos, setKos] = useState(null);
  const [pemilik, setPemilik] = useState(null);
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

      const response = await API.get(`/kosans/${id}`);

      if (!response.data?.data) {
        throw new Error("Data kos tidak ditemukan");
      }

      const kosData = response.data.data;

      // Transform API data to match component structure
      const transformedKos = {
        id: kosData.id,
        name: kosData.nama_kosan,
        location: kosData.alamat,
        price: kosData.harga_per_bulan,
        description: kosData.deskripsi || "",
        type: kosData.kategori?.nama || "Unknown",
        facilities: kosData.fasilitas
          ? typeof kosData.fasilitas === "string"
            ? kosData.fasilitas.split(",").map((f) => f.trim())
            : kosData.fasilitas
          : [],
        rules: kosData.peraturan
          ? typeof kosData.peraturan === "string"
            ? kosData.peraturan.split(",").map((r) => r.trim())
            : kosData.peraturan
          : [],
        images: kosData.galeri
          ? typeof kosData.galeri === "string"
            ? JSON.parse(kosData.galeri)
            : kosData.galeri
          : [],
        jumlah_kamar: kosData.jumlah_kamar || 0,
        pemilikId: kosData.pemilik_id,
      };

      setKos(transformedKos);

      // Fetch pemilik data if pemilik_id exists
      if (kosData.pemilik_id) {
        try {
          const pemilikResponse = await API.get(`/users/${kosData.pemilik_id}`);
          if (pemilikResponse.data?.data) {
            setPemilik({
              id: pemilikResponse.data.data.id,
              name: pemilikResponse.data.data.nama,
              phone: pemilikResponse.data.data.no_hp,
              role: pemilikResponse.data.data.role,
            });
          }
        } catch (pemilikErr) {
          console.error("Error fetching pemilik data:", pemilikErr);
        }
      }
    } catch (err) {
      console.error("Error fetching kos detail:", err);
      setError(err.response?.data?.message || "Gagal mengambil detail kos");
      setKos(null);
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

  const handleWhatsAppClick = () => {
    const message = `Halo, saya tertarik dengan ${kos.name} di ${kos.location}. Apakah masih tersedia?`;
    const whatsappURL = `https://wa.me/${
      pemilik.phone
    }?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
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

  // Tampilkan konten yang bisa diakses tanpa login
  return (
    <>
      <Container className="py-5">
        <Row>
          <Col md={8}>
            {/* Konten detail kos yang bisa dilihat tanpa login */}
            <Card className="mb-4">
              <Carousel>
                {kos?.images?.map((image, index) => (
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

                {pemilik && (
                  <div className="mt-4 p-3 bg-light rounded">
                    <div className="d-flex align-items-center mb-3">
                      <FaUserCircle size={24} className="text-primary me-3" />
                      <div>
                        <h6 className="mb-0">Pemilik Kos</h6>
                        <p className="mb-0 text-muted">{pemilik.name}</p>
                      </div>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="sticky-top" style={{ top: "20px" }}>
              <Card.Body>
                {/* Tombol booking dengan kondisional */}
                <Button
                  variant="primary"
                  className="w-100 mb-3"
                  onClick={handleBookingClick}
                >
                  {isLoggedIn ? "Booking Sekarang" : "Login untuk Booking"}
                </Button>

                {pemilik && (
                  <Button
                    variant="success"
                    className="w-100 d-flex align-items-center justify-content-center gap-2 mb-3"
                    onClick={handleWhatsAppClick}
                  >
                    <FaWhatsapp size={20} />
                    <span>Hubungi Pemilik</span>
                  </Button>
                )}

                {/* Tampilkan opsi login/register jika belum login */}
                {!isLoggedIn && (
                  <div className="text-center">
                    <p className="text-muted mb-2">Belum punya akun?</p>
                    <Button
                      variant="outline-primary"
                      onClick={() => setShowRegister(true)}
                    >
                      Daftar Sekarang
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Modal login/register */}
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
