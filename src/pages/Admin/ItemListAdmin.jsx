import React, { useState, useEffect, useMemo } from "react";
import {
  Table,
  Button,
  Alert,
  Spinner,
  Badge,
  Card,
  Container,
  Form,
  InputGroup,
  Row,
  Col,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaEye, FaSearch, FaFolder, FaHome } from "react-icons/fa";
import { API } from "../../api/config";
import Swal from "sweetalert2";
import { getImageUrl } from "../../utils/imageUtils";

const ItemListAdmin = () => {
  const navigate = useNavigate();
  const [kos, setKos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Add these state variables after other useState declarations
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const filteredKos = useMemo(() => {
    if (!searchTerm) return kos;

    return kos.filter(
      (item) =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ownerPhone.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [kos, searchTerm]);

  // Add this calculation before the return statement
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredKos.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredKos.length / itemsPerPage);

  useEffect(() => {
    fetchAllKos();
  }, []);

  const fetchAllKos = async () => {
    try {
      const response = await API.get("/kosans");
      const kosData = response.data.data;

      // Transform the data to match the expected format
      const transformedData = kosData.map((item) => ({
        id: item.id,
        name: item.nama_kosan,
        location: item.alamat,
        price: item.harga_per_bulan,
        type: item.kategori.nama_kategori,
        ownerName: item.user.name,
        ownerPhone: item.user.nomor,
        description: item.deskripsi,
        totalRooms: item.jumlah_kamar,
        image: item.galeri?.[0] || null, // Add image property
      }));

      setKos(transformedData);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch kos data");
      console.error("Error:", err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data kos yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await API.delete(`/kosans/${id}`);
        await fetchAllKos();
        setError(null);

        // Tampilkan pesan sukses
        Swal.fire("Terhapus!", "Data kos berhasil dihapus.", "success");
      } catch (err) {
        Swal.fire("Error!", "Gagal menghapus data kos", "error");
        console.error("Error:", err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleViewDetail = (id) => {
    navigate(`/admin/kos/detail/${id}`);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Daftar Semua Kos</h2>
          </div>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          <Row className="mb-4">
            <Col>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0">
                  <FaSearch className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  className="border-start-0 bg-light"
                  placeholder="Cari berdasarkan nama, lokasi, atau pemilik..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoComplete="off"
                />
              </InputGroup>
            </Col>
          </Row>

          <div className="mb-3">
            <small className="text-muted">
              Menampilkan {indexOfFirstItem + 1}-
              {Math.min(indexOfLastItem, filteredKos.length)} dari{" "}
              {filteredKos.length} kos
            </small>
          </div>

          {filteredKos.length === 0 ? (
            <div className="text-center py-5">
              <div className="d-flex flex-column align-items-center">
                <div className="mb-3">
                  <FaFolder
                    size={64}
                    className="text-muted"
                    style={{ opacity: 0.5 }}
                  />
                </div>
                <div>
                  <h5 className="text-muted mb-1">Data Tidak Ditemukan</h5>
                  <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                    {searchTerm
                      ? "Tidak ada kos yang sesuai dengan pencarian"
                      : "Tidak ada data kos yang tersedia"}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>No</th>
                    <th>Gambar</th> {/* Add new column */}
                    <th>Nama Kos</th>
                    <th>Pemilik</th>
                    <th>Kontak</th>
                    <th>Lokasi</th>
                    <th>Harga</th>
                    <th>Tipe</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item, index) => (
                    <tr key={item.id}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>
                        <img
                          src={
                            item.image
                              ? getImageUrl(item.image)
                              : "/images/default-kos.jpg"
                          }
                          alt={item.name}
                          style={{
                            width: "60px",
                            height: "60px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/images/default-kos.jpg";
                          }}
                        />
                      </td>
                      <td>{item.name}</td>
                      <td>{item.ownerName}</td>
                      <td>{item.ownerPhone}</td>
                      <td>{item.location}</td>
                      <td>
                        Rp {new Intl.NumberFormat("id-ID").format(item.price)}
                      </td>
                      <td>
                        <Badge
                          bg={
                            item.type === "Putra"
                              ? "primary"
                              : item.type === "Putri"
                              ? "danger"
                              : "success"
                          }
                        >
                          {item.type}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => handleViewDetail(item.id)}
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "35px", height: "35px" }}
                            title="Detail"
                          >
                            <FaEye size={14} />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(item.id)}
                            disabled={loading}
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "35px", height: "35px" }}
                            title="Hapus"
                          >
                            {loading ? (
                              <Spinner animation="border" size="sm" />
                            ) : (
                              <FaTrash size={14} />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4 gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "35px", height: "35px" }}
                  >
                    &lt;
                  </Button>

                  {[...Array(totalPages)].map((_, idx) => (
                    <Button
                      key={idx + 1}
                      variant={
                        currentPage === idx + 1 ? "primary" : "outline-primary"
                      }
                      size="sm"
                      onClick={() => setCurrentPage(idx + 1)}
                      className="rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: "35px", height: "35px" }}
                    >
                      {idx + 1}
                    </Button>
                  ))}

                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "35px", height: "35px" }}
                  >
                    &gt;
                  </Button>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ItemListAdmin;
