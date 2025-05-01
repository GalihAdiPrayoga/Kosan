import React, { useState, useEffect } from "react";
import { Table, Button, Alert, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom";
import { API, deleteKos } from "../../api/config";

const ItemListAdmin = () => {
  const [kos, setKos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchKos();
  }, []);

  const fetchKos = async () => {
    try {
      const response = await API.get("/kos");
      setKos(response.data);
    } catch (err) {
      setError("Failed to fetch kos data");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus kos ini?")) {
      try {
        setLoading(true);
        await deleteKos(id);
        setKos(kos.filter((item) => item.id !== id));
        // Tambahkan notifikasi sukses jika diperlukan
      } catch (err) {
        setError("Gagal menghapus data kos");
      } finally {
        setLoading(false);
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Daftar Kos</h2>
        <Button as={Link} to="/admin/kos/add" variant="primary">
          Tambah Kos
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover>
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
    </div>
  );
};

export default ItemListAdmin;
