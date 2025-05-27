import React, { useState, useEffect } from "react";
import {
  Container,
  Button,
  Badge,
  Spinner,
  Card,
  Alert,
  Row,
  Col,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaPlus, FaEllipsisV, FaMapMarkerAlt } from "react-icons/fa";
import { API } from "../../api/config"; // Pastikan API ini dikonfigurasi dengan benar

const ManageKos = () => {
  const [kosList, setKosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const ITEMS_PER_PAGE = 6; // Show 6 items per page

  useEffect(() => {
    fetchKosList();
  }, []);

  const fetchKosList = async () => {
    try {
      const userId = localStorage.getItem("userId");

      // Gantilah URL API dengan URL API yang sesuai dengan API kosans
      const response = await API.get("/kosans");  // Sesuaikan dengan endpoint yang benar

      // Pastikan API kosans memberikan data dalam format yang benar
      const ownerKos = response.data.filter(
        (kos) => kos.pemilikId.toString() === userId
      );

      setKosList(ownerKos);
      setLoading(false);
    } catch (err) {
      setError("Gagal memuat daftar kos");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kos ini?")) {
      try {
        const userId = localStorage.getItem("userId");
        const kosToDelete = kosList.find((kos) => kos.id === id);

        // Verifikasi kepemilikan sebelum menghapus
        if (kosToDelete.pemilikId.toString() !== userId) {
          throw new Error("Anda tidak memiliki izin untuk menghapus kos ini");
        }

        // Gantilah URL API dengan URL API untuk menghapus data kos
        await API.delete(`/kosans/${id}`);  // Sesuaikan dengan endpoint penghapusan yang benar
        setKosList(kosList.filter((kos) => kos.id !== id));
      } catch (err) {
        setError(err.message || "Gagal menghapus kos");
      }
    }
  };

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = kosList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(kosList.length / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const renderPagination = () => {
    return (
      <div className="d-flex justify-content-center gap-2 mt-4">
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
          <Button
            key={number}
            variant={currentPage === number ? "primary" : "outline-primary"}
            size="sm"
            onClick={() => handlePageChange(number)}
          >
            {number}
          </Button>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container fluid className="py-4">
      <Card className="border-0 mb-4">
        <Card.Body className="px-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1 fw-bold">Daftar Kos Saya</h2>
              <p className="text-muted mb-0">Kelola properti kos Anda</p>
            </div>
            <Button
              as={Link}
              to="/pemilik/kos/add"
              variant="primary"
              className="d-flex align-items-center gap-2 px-3 py-2"
            >
              <FaPlus /> Tambah Kos
            </Button>
          </div>

          {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

          {kosList.length === 0 ? (
            <Alert variant="info" className="text-center py-4">
              <h5 className="mb-2">Belum Ada Kos</h5>
              <p className="mb-0">Anda belum memiliki kos yang terdaftar. Silakan tambah kos baru.</p>
            </Alert>
          ) : (
            <Row className="g-4">
              {currentItems.map((kos) => (
                <Col lg={3} md={4} sm={6} key={kos.id}>
                  <Card className="h-100 border hover-card">
                    <div style={{ position: "relative" }}>
                      <Card.Img
                        variant="top"
                        src={kos.images?.[0]}
                        style={{
                          height: "160px",
                          objectFit: "cover",
                        }}
                      />
                      <div
                        style={{
                          position: "absolute",
                          top: "8px",
                          right: "8px",
                          zIndex: 2,
                        }}
                      >
                        <div className="position-relative">
                          <button
                            className="p-0 border-0 shadow-none"
                            onClick={() => setActiveMenuId(activeMenuId === kos.id ? null : kos.id)}
                            style={{
                              width: "28px",
                              height: "28px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "rgba(255, 255, 255, 0.9)",
                              borderRadius: "50%",
                              color: "#444",
                              cursor: "pointer",
                            }}
                          >
                            <FaEllipsisV size={12} />
                          </button>
                          {activeMenuId === kos.id && (
                            <div
                              className="position-absolute bg-white rounded shadow-sm py-1"
                              style={{
                                top: "100%",
                                right: 0,
                                marginTop: "4px",
                                minWidth: "120px",
                                zIndex: 3,
                              }}
                            >
                              <Link
                                to={`/pemilik/kos/edit/${kos.id}`}
                                className="d-flex align-items-center px-3 py-2 text-decoration-none text-dark hover-bg-light"
                                style={{ fontSize: "0.9rem" }}
                              >
                                <i className="bi bi-pencil me-2"></i>Edit
                              </Link>
                              <button
                                onClick={() => handleDelete(kos.id)}
                                className="d-flex align-items-center px-3 py-2 text-danger border-0 bg-transparent w-100 text-start"
                                style={{ fontSize: "0.9rem" }}
                              >
                                <i className="bi bi-trash me-2"></i>Hapus
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                      <Badge
                        bg={
                          kos.type === "Putra"
                            ? "primary"
                            : kos.type === "Putri"
                            ? "danger"
                            : "success"
                        }
                        className="position-absolute"
                        style={{
                          top: "12px",
                          left: "12px",
                          padding: "8px 12px",
                          fontSize: "0.85rem",
                        }}
                      >
                        Kos {kos.type}
                      </Badge>
                    </div>
                    <Card.Body className="p-3">
                      <Card.Title className="h6 mb-2 fw-bold text-truncate">
                        {kos.name}
                      </Card.Title>
                      <div className="d-flex align-items-center mb-2 text-muted">
                        <FaMapMarkerAlt className="me-1" size={12} />
                        <small className="text-truncate">{kos.location}</small>
                      </div>
                      <div className="mb-2">
                        {kos.facilities?.slice(0, 2).map((facility, index) => (
                          <Badge
                            bg="light"
                            text="dark"
                            className="me-1 mb-1 py-1 px-2"
                            key={index}
                            style={{ fontSize: "0.7rem" }}
                          >
                            {facility}
                          </Badge>
                        ))}
                      </div>
                      <div className="mt-2 pt-2 border-top">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <span className="h6 text-primary mb-0">
                              Rp {new Intl.NumberFormat("id-ID").format(kos.price)}
                            </span>
                            <span className="text-muted ms-1" style={{ fontSize: "0.8rem" }}>
                              /bulan
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}

          {totalPages > 1 && (
            <div className="mt-5">
              {renderPagination()}
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ManageKos;
