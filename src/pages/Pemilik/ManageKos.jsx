import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Badge,
  Spinner,
  Card,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { API } from "../../api/config";

const ManageKos = () => {
  const [kosList, setKosList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchKosList();
  }, []);

  const fetchKosList = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await API.get("/db.json");
      
      // Filter kos based on pemilikId matching the logged-in user's ID
      const ownerKos = response.data.kos.filter(
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
        const kosToDelete = kosList.find(kos => kos.id === id);

        // Verify ownership before deletion
        if (kosToDelete.pemilikId.toString() !== userId) {
          throw new Error("Anda tidak memiliki izin untuk menghapus kos ini");
        }

        await API.delete(`/kos/${id}`);
        setKosList(kosList.filter((kos) => kos.id !== id));
      } catch (err) {
        setError(err.message || "Gagal menghapus kos");
      }
    }
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
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Daftar Kos Saya</h2>
            <Button
              as={Link}
              to="/pemilik/kos/add"
              variant="primary"
              className="d-flex align-items-center gap-2"
            >
              <FaPlus /> Tambah Kos
            </Button>
          </div>

          {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

          {kosList.length === 0 ? (
            <Alert variant="info">
              Anda belum memiliki kos yang terdaftar. Silakan tambah kos baru.
            </Alert>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Nama Kos</th>
                  <th>Lokasi</th>
                  <th>Tipe</th>
                  <th>Harga</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {kosList.map((kos) => (
                  <tr key={kos.id}>
                    <td>{kos.name}</td>
                    <td>{kos.location}</td>
                    <td>
                      <Badge
                        bg={
                          kos.type === "Putra"
                            ? "primary"
                            : kos.type === "Putri"
                            ? "danger"
                            : "success"
                        }
                      >
                        {kos.type}
                      </Badge>
                    </td>
                    <td>Rp {new Intl.NumberFormat("id-ID").format(kos.price)}</td>
                    <td>
                      <Badge bg="success">Active</Badge>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          as={Link}
                          to={`/pemilik/kos/edit/${kos.id}`}
                          variant="outline-primary"
                          size="sm"
                          title="Edit"
                        >
                          <FaEdit />
                        </Button>
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleDelete(kos.id)}
                          title="Hapus"
                        >
                          <FaTrash />
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

export default ManageKos;
