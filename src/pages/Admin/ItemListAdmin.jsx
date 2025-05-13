import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Alert,
  Spinner,
  Badge,
  Card,
  Container,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash, FaEye } from "react-icons/fa";
import { API } from "../../api/config";

const ItemListAdmin = () => {
  const navigate = useNavigate();
  const [kos, setKos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    if (window.confirm("Apakah Anda yakin ingin menghapus kos ini?")) {
      try {
        setLoading(true);
        await API.delete(`/kosans/${id}`);
        // Refresh data after successful deletion
        await fetchAllKos();
        setError(null);
      } catch (err) {
        setError("Gagal menghapus data kos");
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

          {kos.length === 0 ? (
            <Alert variant="info">Belum ada data kos yang tersedia.</Alert>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>No</th>
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
                {kos.map((item, index) => (
                  <tr key={item.id}>
                    <td>{index + 1}</td>
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
                          title="Detail"
                        >
                          <FaEye />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(item.id)}
                          disabled={loading}
                          title="Hapus"
                        >
                          {loading ? (
                            <Spinner
                              as="span"
                              animation="border"
                              size="sm"
                              role="status"
                              aria-hidden="true"
                            />
                          ) : (
                            <FaTrash />
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ItemListAdmin;
