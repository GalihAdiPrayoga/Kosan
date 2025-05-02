import React, { useState, useEffect } from "react";
import { Table, Button, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { API, fetchKosData, deleteKos } from "../../api/config";

const ItemListAdmin = () => {
  const [kos, setKos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const adminId = localStorage.getItem("userId");
    if (!adminId) {
      setError("Admin ID not found");
      setLoading(false);
      return;
    }
    fetchKosList(adminId);
  }, []);

  const fetchKosList = async (adminId) => {
    try {
      const data = await fetchKosData(adminId);
      setKos(data);
    } catch (err) {
      setError("Failed to fetch kos data");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kos ini?")) {
      try {
        setLoading(true);
        const adminId = localStorage.getItem("userId");
        // Check if the kos belongs to the admin
        const kosToDelete = kos.find(k => k.id === id);
        if (String(kosToDelete.adminId) !== String(adminId)) {
          throw new Error("You don't have permission to delete this kos");
        }
        await deleteKos(id);
        setKos(kos.filter((item) => item.id !== id));
      } catch (err) {
        setError(err.message || "Gagal menghapus data kos");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Daftar Kos Saya</h2>
        <Button as={Link} to="/admin/kos/add" variant="primary">
          Tambah Kos
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      {kos.length === 0 ? (
        <Alert variant="info">
          Anda belum memiliki data kos. Silakan tambah kos baru.
        </Alert>
      ) : (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Kos</th>
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
                <td>{item.location}</td>
                <td>Rp {new Intl.NumberFormat("id-ID").format(item.price)}</td>
                <td>{item.type}</td>
                <td>
                  <Button
                    as={Link}
                    to={`/admin/kos/edit/${item.id}`}
                    variant="warning"
                    size="sm"
                    className="me-2"
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDelete(item.id)}
                    disabled={loading}
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
                      "Hapus"
                    )}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default ItemListAdmin;
