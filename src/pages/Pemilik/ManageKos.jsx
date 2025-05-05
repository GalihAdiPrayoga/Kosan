import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Button,
  Badge,
  Spinner,
  Card,
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
      const ownerKos = response.data.kos.filter(
        (kos) => kos.adminId.toString() === userId
      );
      setKosList(ownerKos);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch kos list");
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this kos?")) {
      try {
        await API.delete(`/kos/${id}`);
        setKosList(kosList.filter((kos) => kos.id !== id));
      } catch (err) {
        setError("Failed to delete kos");
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
            <h2 className="mb-0">Daftar Kos</h2>
            <Button
              as={Link}
              to="/pemilik/kos/add"
              variant="primary"
              className="d-flex align-items-center gap-2"
            >
              <FaPlus /> Tambah Kos
            </Button>
          </div>

          <Table responsive hover>
            <thead>
              <tr>
                <th>Nama Kos</th>
                <th>Lokasi</th>
                <th>Tipe</th>
                <th>Harga</th>
                <th>Status</th>
                <th>Actions</th>
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
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDelete(kos.id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {error && <div className="text-danger text-center mt-3">{error}</div>}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ManageKos;
