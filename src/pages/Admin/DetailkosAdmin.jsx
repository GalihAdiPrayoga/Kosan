import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Carousel,
  Alert,
  Badge,
  Spinner,
} from "react-bootstrap";
import { useParams } from "react-router-dom";
import { FaUserCircle, FaBed, FaMapMarkerAlt } from "react-icons/fa";
import { API } from "../../api/config";
import { getImageUrl } from "../../utils/imageUtils";

const DetailKosAdmin = () => {
  const { id } = useParams();
  const [kos, setKos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchKosDetail();
  }, [id]);

  const fetchKosDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await API.get(`/kosans/${id}`);
      const kosData = response.data;

      if (!kosData) {
        throw new Error("Data kos tidak ditemukan");
      }

      const transformedData = {
        id: kosData.id,
        nama_kosan: kosData.nama_kosan || "Tidak ada nama",
        alamat: kosData.alamat || "Lokasi tidak tersedia",
        harga_per_bulan: Number(kosData.harga_per_bulan) || 0,
        deskripsi: kosData.deskripsi || "",
        kategori: kosData.kategori?.nama_kategori || "Campur",
        fasilitas: Array.isArray(kosData.fasilitas)
          ? kosData.fasilitas.map((f) => ({
              id: f.id,
              nama_fasilitas: f.nama_fasilitas,
              icon: f.icon ? f.icon.replace("fa-", "") : "check", // Remove fa- prefix if present
            }))
          : [],
        galeri: Array.isArray(kosData.galeri)
          ? kosData.galeri
          : kosData.galeri
          ? [kosData.galeri]
          : [],
        jumlah_kamar: Number(kosData.jumlah_kamar) || 0,
        user: {
          name: kosData.user?.name || "Tidak ada nama",
          phone: kosData.user?.nomor || "Tidak tersedia",
        },
      };

      setKos(transformedData);
    } catch (err) {
      console.error("Error in fetchKosDetail:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Gagal mengambil detail kos"
      );
      setKos(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Row>
        <Col md={8}>
          <Card className="mb-4 shadow-sm">
            <Carousel>
              {kos?.galeri?.map((image, index) => (
                <Carousel.Item key={index}>
                  <img
                    className="d-block w-100"
                    src={getImageUrl(image)}
                    alt={`${kos.nama_kosan} - ${index + 1}`}
                    style={{ height: "400px", objectFit: "cover" }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "/images/default-kos.jpg";
                    }}
                  />
                </Carousel.Item>
              ))}
            </Carousel>

            <Card.Body>
              <div className="d-flex justify-content-between mb-4">
                <div>
                  <h2>{kos?.nama_kosan}</h2>
                  <p className="text-muted">
                    <FaMapMarkerAlt className="me-2" />
                    {kos?.alamat}
                  </p>
                </div>
                <Badge bg="primary" className="h-fit">
                  {kos?.kategori}
                </Badge>
              </div>

              <hr />

              <div className="mb-4">
                <h5>Deskripsi</h5>
                <p className="text-muted">{kos?.deskripsi}</p>
              </div>

              {kos?.fasilitas?.length > 0 && (
                <div className="mb-4">
                  <h5 className="mb-3">Fasilitas</h5>
                  <Row className="g-3">
                    {kos.fasilitas.map((facility) => (
                      <Col key={facility.id} xs={6} md={4}>
                        <div className="d-flex align-items-center p-2 bg-light rounded">
                          <i
                            className={`fas fa-${facility.icon} text-primary me-2`}
                          ></i>
                          <span>{facility.nama_fasilitas}</span>
                        </div>
                      </Col>
                    ))}
                  </Row>
                </div>
              )}

              {kos?.user && (
                <div className="bg-light p-4 rounded">
                  <h5>Informasi Pemilik</h5>
                  <div className="d-flex align-items-center">
                    <FaUserCircle size={40} className="text-primary me-3" />
                    <div>
                      <h6 className="mb-1">{kos.user.name}</h6>
                      <p className="mb-0 text-muted">{kos.user.phone}</p>
                    </div>
                  </div>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="sticky-top" style={{ top: "2rem" }}>
            <Card.Body>
              <h5 className="text-primary mb-3">
                Rp {new Intl.NumberFormat("id-ID").format(kos?.harga_per_bulan)}
                <small className="text-muted">/bulan</small>
              </h5>

              <div className="mb-3">
                <FaBed className="me-2" />
                {kos?.jumlah_kamar} Kamar
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DetailKosAdmin;
