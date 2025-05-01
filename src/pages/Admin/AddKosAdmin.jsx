import React, { useState } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { API } from "../../api/config";

const AddKosAdmin = () => {
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    type: "",
    description: "",
    facilities: [],
    rules: [],
    images: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/kos", formData);
      navigate("/admin/kos");
    } catch (err) {
      setError("Failed to add kos");
    }
  };

  return (
    <div>
      <h2 className="mb-4">Tambah Kos</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Card>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nama Kos</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Lokasi</Form.Label>
              <Form.Control
                type="text"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Harga</Form.Label>
              <Form.Control
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: Number(e.target.value) })
                }
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tipe</Form.Label>
              <Form.Select
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                required
              >
                <option value="">Pilih Tipe</option>
                <option value="Putra">Putra</option>
                <option value="Putri">Putri</option>
                <option value="Campur">Campur</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                as="textarea"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary">
              Simpan
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AddKosAdmin;
