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
  Spinner,
} from "react-bootstrap";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

import { API } from "../../api/config";
import { getImageUrl } from "../../utils/imageUtils";
import AuthModals from "../../components/AuthModals";
import {
  FaUserCircle,
  FaWhatsapp,
  FaBed,
  FaMapMarkerAlt,
} from "react-icons/fa";

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

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/kosans/public/${id}`
      );
      console.log("Raw API Response:", response.data);

      if (response?.data?.data?.[0]) {
        const kosData = response.data.data[0];

        // Transform kos data
        const transformedKos = {
          id: kosData.id,
          nama_kosan: kosData.nama_kosan,
          alamat: kosData.alamat,
          harga_per_bulan: Number(kosData.harga_per_bulan),
          deskripsi: kosData.deskripsi,
          kategori: kosData.kategori?.nama_kategori,
          fasilitas: kosData.fasilitas.map((f) => ({
            id: f.id,
            nama_fasilitas: f.nama_fasilitas,
            icon: f.icon,
          })),
          galeri: Array.isArray(kosData.galeri)
            ? kosData.galeri
            : [kosData.galeri],
          jumlah_kamar: Number(kosData.jumlah_kamar),
          user_id: kosData.user_id,
        };

        setKos(transformedKos);

        // Set pemilik data from nested user object
        if (kosData.user) {
          setPemilik({
            id: kosData.user.id,
            name: kosData.user.name,
            phone: kosData.user.nomor,
            role: kosData.user.role,
          });
        }
      } else {
        throw new Error("Data kos tidak ditemukan");
      }
    } catch (err) {
      console.error("Error in fetchKosDetail:", err);
      if (err.response?.status === 404) {
        setError("Kos tidak ditemukan");
      } else {
        setError(
          err.response?.data?.message ||
            "Gagal mengambil detail kos. Silakan coba lagi."
        );
      }
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
    if (pemilik && pemilik.phone) {
      const message = `Halo, saya tertarik dengan ${kos.nama_kosan} di ${kos.alamat}. Apakah masih tersedia?`;
      const phoneNumber = pemilik.phone.startsWith("62")
        ? pemilik.phone
        : `62${pemilik.phone.replace(/^0/, "")}`;
      const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
        message
      )}`;
      window.open(whatsappURL, "_blank");
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Memuat detail kos...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Terjadi Kesalahan</Alert.Heading>
          <p>{error}</p>
          <hr />
          <div className="d-flex justify-content-between">
            <Button
              variant="outline-danger"
              onClick={() => window.location.reload()}
            >
              Coba Lagi
            </Button>
            <Link to="/search" className="btn btn-outline-primary">
              Kembali ke Pencarian
            </Link>
          </div>
        </Alert>
      </Container>
    );
  }

  if (!kos) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Kos tidak ditemukan
          <div className="mt-3">
            <Link to="/search" className="btn btn-outline-warning">
              Kembali ke Pencarian
            </Link>
          </div>
        </Alert>
      </Container>
    );
  }

  return (
    <>
      <Container className="py-5">
        <Row>
          <Col md={8}>
            <Card className="mb-4 shadow-sm">
              <Carousel interval={null}>
                {kos?.galeri?.length > 0 ? (
                  kos.galeri.map((image, index) => (
                    <Carousel.Item key={index}>
                      <img
                        className="d-block w-100"
                        src={getImageUrl(image)}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "/images/default-kos.jpg";
                        }}
                        alt={`${kos.nama_kosan} - Image ${index + 1}`}
                        style={{ height: "400px", objectFit: "cover" }}
                      />
                    </Carousel.Item>
                  ))
                ) : (
                  <Carousel.Item>
                    <img
                      className="d-block w-100"
                      src="/images/default-kos.jpg"
                      alt="Default kos"
                      style={{ height: "400px", objectFit: "cover" }}
                    />
                  </Carousel.Item>
                )}
              </Carousel>
            </Card>

            <Card className="mb-4 shadow-sm">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <div>
                    <h2 className="mb-2">
                      {kos?.nama_kosan || "Tidak ada nama"}
                    </h2>
                    <p className="text-muted mb-2 d-flex align-items-center">
                      <FaMapMarkerAlt className="me-2" />
                      {kos?.alamat || "Lokasi tidak tersedia"}
                    </p>
                  </div>
                  {kos?.kategori && (
                    <Badge
                      bg={
                        kos.kategori.toLowerCase().includes("putra")
                          ? "primary"
                          : kos.kategori.toLowerCase().includes("putri")
                          ? "danger"
                          : "success"
                      }
                      className="px-3 py-2"
                    >
                      {kos.kategori}
                    </Badge>
                  )}
                </div>

                <div className="mb-4">
                  <h5 className="text-primary mb-0">
                    Rp{" "}
                    {new Intl.NumberFormat("id-ID").format(
                      kos?.harga_per_bulan || 0
                    )}
                  </h5>
                  <small className="text-muted">/bulan</small>
                </div>

                <hr />

                {kos?.deskripsi && (
                  <div className="mb-4">
                    <h5 className="mb-3">Deskripsi</h5>
                    <p className="text-muted">{kos.deskripsi}</p>
                  </div>
                )}

                {kos?.fasilitas?.length > 0 && (
                  <div className="mb-4">
                    <h5 className="mb-3">Fasilitas</h5>
                    <Row className="g-3">
                      {kos.fasilitas.map((facility) => (
                        <Col key={facility.id} xs={6} md={4}>
                          <div className="d-flex align-items-center p-2 bg-light rounded">
                            <i
                              className={`fas ${facility.icon} text-primary me-2`}
                            ></i>
                            <span>{facility.nama_fasilitas}</span>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                {kos?.rules?.length > 0 && (
                  <div className="mb-4">
                    <h5 className="mb-3">Peraturan Kos</h5>
                    <ul className="text-muted">
                      {kos.rules.map((rule, index) => (
                        <li key={index}>{rule}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {pemilik && (
                  <div className="mt-4 p-4 bg-light rounded-3">
                    <h5 className="mb-3">Informasi Pemilik</h5>
                    <div className="d-flex align-items-center">
                      <div className="bg-primary rounded-circle p-2 me-3">
                        <FaUserCircle size={40} className="text-white" />
                      </div>
                      <div>
                        <h6 className="mb-1">{pemilik.name}</h6>
                        <p className="mb-2 text-muted">
                          <small>Pemilik Kos</small>
                        </p>
                        <div className="d-flex gap-2">
                          <Badge bg="light" text="dark">
                            <FaWhatsapp className="me-1" />
                            {pemilik.phone}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={4}>
            <Card className="sticky-top shadow-sm" style={{ top: "20px" }}>
              <Card.Body>
                <div className="mb-4">
                  <h5 className="text-primary mb-3">
                    Rp{" "}
                    {new Intl.NumberFormat("id-ID").format(kos.harga_per_bulan)}
                    <small className="text-muted">/bulan</small>
                  </h5>
                  <p className="mb-2 d-flex align-items-center">
                    <FaBed className="me-2" />
                    {kos.jumlah_kamar} kamar tersedia
                  </p>
                </div>

                <Button
                  variant="primary"
                  size="lg"
                  className="w-100 mb-3"
                  onClick={handleBookingClick}
                >
                  {isLoggedIn ? "Booking Sekarang" : "Login untuk Booking"}
                </Button>

                {pemilik && pemilik.phone && (
                  <Button
                    variant="success"
                    size="lg"
                    className="w-100 d-flex align-items-center justify-content-center gap-2"
                    onClick={handleWhatsAppClick}
                  >
                    <FaWhatsapp size={24} />
                    <span>Chat via WhatsApp</span>
                  </Button>
                )}

                {!isLoggedIn && (
                  <div className="text-center mt-4">
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
