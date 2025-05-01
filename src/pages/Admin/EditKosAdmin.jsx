import React, { useState, useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../../api/config";

const EditKosAdmin = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    type: "",
    description: "",
    facilities: [],
    rules: [],
  });

  useEffect(() => {
    fetchKosDetail();
  }, [id]);

  const fetchKosDetail = async () => {
    try {
      const response = await API.get(`/kos/${id}`);
      setFormData(response.data);
    } catch (err) {
      setError("Failed to fetch kos detail");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/kos/${id}`, formData);
      navigate("/admin/kos");
    } catch (err) {
      setError("Failed to update kos");
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="mb-4">Edit Kos</h2>
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
              Update
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default EditKosAdmin;
