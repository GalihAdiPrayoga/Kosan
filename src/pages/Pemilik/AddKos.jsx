import React, { useState } from "react";
import { Container, Form, Button, Card, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { API } from "../../api/config";

const AddKos = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    price: "",
    type: "Putra",
    description: "",
    facilities: [],
    images: [],
    rules: [""],
  });

  const facilityOptions = [
    "AC",
    "WiFi",
    "Kamar Mandi Dalam",
    "Laundry",
    "Parkir",
    "Dapur",
    "TV",
    "Meja",
    "Lemari",
    "Kasur",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userId = localStorage.getItem("userId");
      const newKos = {
        ...formData,
        adminId: userId,
        price: parseInt(formData.price),
      };

      await API.post("/kos", newKos);
      navigate("/pemilik/kos");
    } catch (err) {
      console.error("Failed to add kos:", err);
    }
  };

  const handleFacilityChange = (facility) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="mb-4">Tambah Kos Baru</h2>

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
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
                  <Form.Label>Harga per Bulan</Form.Label>
                  <Form.Control
                    type="number"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Tipe Kos</Form.Label>
                  <Form.Select
                    value={formData.type}
                    onChange={(e) =>
                      setFormData({ ...formData, type: e.target.value })
                    }
                  >
                    <option value="Putra">Kos Putra</option>
                    <option value="Putri">Kos Putri</option>
                    <option value="Campur">Kos Campur</option>
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Deskripsi</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Fasilitas</Form.Label>
                  <div className="d-flex flex-wrap gap-2">
                    {facilityOptions.map((facility) => (
                      <Form.Check
                        key={facility}
                        type="checkbox"
                        label={facility}
                        checked={formData.facilities.includes(facility)}
                        onChange={() => handleFacilityChange(facility)}
                        className="me-3"
                      />
                    ))}
                  </div>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Upload Foto</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) => {
                      // Handle image upload
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button
                variant="secondary"
                onClick={() => navigate("/pemilik/kos")}
              >
                Batal
              </Button>
              <Button type="submit" variant="primary">
                Simpan
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AddKos;
