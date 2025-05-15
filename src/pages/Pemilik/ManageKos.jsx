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
import { getImageUrl } from "../../utils/imageUtils";
import ImageWithFallback from "../../components/ImageWithFallback";
import Swal from "sweetalert2";
import notFoundImage from "../../assets/notfound.jpg"; // Replace the existing animation import

const ManageKos = () => {
  const [kosList, setKosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [activeMenuId, setActiveMenuId] = useState(null);
  const ITEMS_PER_PAGE = 6; // Show 6 items per page

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      setError("Silakan login terlebih dahulu");
      setLoading(false);
      return;
    }

    fetchKosList();
  }, []);

  useEffect(() => {
    // Add right after fetchKosList();
    console.log("KosList:", kosList);
  }, [kosList]);

  useEffect(() => {
    if (kosList.length > 0) {
      kosList.forEach((kos) => {
        if (kos.galeri?.length > 0) {
          console.log("Debug Path:", {
            asli: kos.galeri[0],
            dibersihkan: kos.galeri[0].replace(/^kosans\//, ""),
            hasil: getImageUrl(kos.galeri[0]),
          });
        }
      });
    }
  }, [kosList]);

  // Update the fetchKosList function first to properly transform the data
  const fetchKosList = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User ID tidak ditemukan. Silakan login kembali.");
        setLoading(false);
        return;
      }

      const response = await API.get(`/kosans/owner/${userId}`);
      console.log("Raw API Response:", response.data);

      if (response?.data?.data) {
        const transformedData = response.data.data.map((kos) => ({
          ...kos,
          // Ensure galeri paths are properly formatted
          galeri: Array.isArray(kos.galeri) ? kos.galeri : [kos.galeri],
        }));
        console.log("Transformed Data:", transformedData);
        setKosList(transformedData);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching kos list:", err);
      setError(err.response?.data?.message || "Gagal memuat daftar kos");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data kos yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      cancelButtonText: "Batal",
      confirmButtonText: "Ya, hapus!",
      reverseButtons: false, // <-- ubah ke false atau bisa dihapus saja
    });

    if (result.isConfirmed) {
      try {
        const userId = localStorage.getItem("userId");
        const kosToDelete = kosList.find((kos) => kos.id === id);

        if (!kosToDelete || kosToDelete.user_id.toString() !== userId) {
          throw new Error("Anda tidak memiliki izin untuk menghapus kos ini");
        }

        await API.delete(`/kosans/${id}`);
        setKosList((prevList) => prevList.filter((kos) => kos.id !== id));

        // Tampilkan pesan sukses
        await Swal.fire({
          title: "Berhasil!",
          text: "Data kos telah dihapus.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      } catch (err) {
        // Tampilkan pesan error
        await Swal.fire({
          title: "Error!",
          text: err.message || "Gagal menghapus data kos",
          icon: "error",
          confirmButtonColor: "#dc3545",
        });
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

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          {kosList.length === 0 ? (
            <div className="text-center py-5">
              <div className="d-flex flex-column align-items-center">
                <div className="mb-4">
                  <img
                    src={notFoundImage}
                    alt="No Data Found"
                    style={{
                      width: "250px",
                      height: "auto",
                      objectFit: "contain",
                      opacity: 0.9,
                      borderRadius: "8px",
                    }}
                  />
                </div>
                <div>
                  <h5 className="text-muted mb-2">Belum Ada Kos</h5>
                  <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                    Anda belum memiliki kos yang terdaftar. Silakan tambah kos
                    baru.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Row className="g-4">
              {currentItems.map((kos, index) => (
                <Col lg={3} md={4} sm={6} key={kos.id || index}>
                  {/* Hapus Link di sini */}
                  <Card
                    className="h-100 border hover-card"
                    style={{ cursor: "pointer" }}
                  >
                    <div style={{ position: "relative" }}>
                      <Card.Img
                        variant="top"
                        src={
                          kos.galeri?.[0] ? getImageUrl(kos.galeri[0]) : null
                        }
                        style={{
                          height: "160px",
                          objectFit: "cover",
                          backgroundColor: "#f8f9fa",
                        }}
                        onError={(e) => {
                          console.log("Failed to load image:", e.target.src);
                          // Try next image only once to prevent infinite loop
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
                          }
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
                            onClick={() =>
                              setActiveMenuId(
                                activeMenuId === kos.id ? null : kos.id
                              )
                            }
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
                          kos.kategori?.nama_kategori?.toLowerCase() === "putra"
                            ? "primary"
                            : kos.kategori?.nama_kategori?.toLowerCase() ===
                              "putri"
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
                        {kos.kategori?.nama_kategori || "Campuran"}
                      </Badge>
                    </div>
                    <Card.Body className="p-3">
                      <Card.Title className="h6 mb-2 fw-bold text-truncate">
                        {kos.nama_kosan || "Nama tidak tersedia"}
                      </Card.Title>
                      <div className="d-flex align-items-center mb-2 text-muted">
                        <FaMapMarkerAlt className="me-1" size={12} />
                        <small className="text-truncate">
                          {kos.alamat || "Alamat tidak tersedia"}
                        </small>
                      </div>

                      {/* Facilities */}
                      <div className="mb-2">
                        {kos.fasilitas &&
                          Array.isArray(kos.fasilitas) &&
                          kos.fasilitas.slice(0, 2).map((facility, index) => (
                            <Badge
                              bg="light"
                              text="dark"
                              className="me-1 mb-1 py-1 px-2"
                              key={index}
                              style={{ fontSize: "0.7rem" }}
                            >
                              {facility.nama_fasilitas}
                            </Badge>
                          ))}
                      </div>

                      {/* Price */}
                      <div className="mt-2 pt-2 border-top">
                        <div className="d-flex justify-content-between align-items-center">
                          <div>
                            <span className="h6 text-primary mb-0">
                              Rp{" "}
                              {new Intl.NumberFormat("id-ID").format(
                                kos.harga_per_bulan || 0
                              )}
                            </span>
                            <span
                              className="text-muted ms-1"
                              style={{ fontSize: "0.8rem" }}
                            >
                              /bulan
                            </span>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                  {/* Hapus penutup Link di sini */}
                </Col>
              ))}
            </Row>
          )}

          {totalPages > 1 && <div className="mt-5">{renderPagination()}</div>}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ManageKos;
