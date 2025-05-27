import React, { useState, useEffect } from "react";
import { 
  Button, 
  Form, 
  Alert, 
  Spinner, 
  Row, 
  Col, 
  Card, 
  Container,
  FloatingLabel 
} from "react-bootstrap";
import { API } from "../../api/config";

const AddKos = () => {
  const [formData, setFormData] = useState({
    user_id: "",
    kategori_id: "",
    name: "",
    location: "",
    description: "",
    jumlah_kamar: 1,
    price: 0,
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await API.get("/kategoris");
        if (response.data && Array.isArray(response.data)) {
          setCategories(response.data);
        } else {
          setError("Kategori kos tidak ditemukan.");
        }
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError("Gagal mengambil kategori kos.");
      }
    };

    fetchCategories();
    
    const userId = localStorage.getItem("userId");
    if (userId) {
      setFormData((prevState) => ({ ...prevState, user_id: userId }));
    } else {
      setError("User belum login. Silakan login terlebih dahulu.");
    }
  }, []);

  const handleFileChange = (e) => {
    setUploadedImages(e.target.files);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    const formDataToSend = new FormData();
    formDataToSend.append("user_id", formData.user_id);
    formDataToSend.append("kategori_id", formData.kategori_id);
    formDataToSend.append("nama_kosan", formData.name);
    formDataToSend.append("alamat", formData.location);
    formDataToSend.append("deskripsi", formData.description);
    formDataToSend.append("jumlah_kamar", formData.jumlah_kamar);
    formDataToSend.append("harga_per_bulan", formData.price);

    for (let i = 0; i < uploadedImages.length; i++) {
      formDataToSend.append("galeri[]", uploadedImages[i]);
    }

    try {
      const response = await API.post("/kosans", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        setSuccess("Kos berhasil ditambahkan!");
        // Reset form
        setFormData({
          user_id: formData.user_id,
          kategori_id: "",
          name: "",
          location: "",
          description: "",
          jumlah_kamar: 1,
          price: 0,
        });
        setUploadedImages([]);
      } else {
        setError("Gagal menambahkan kos.");
      }
    } catch (err) {
      console.error("Error adding kos:", err);
      setError(err.response?.data?.message || "Terjadi kesalahan, coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white">
              <h2 className="mb-0">Tambah Kos Baru</h2>
            </Card.Header>
            <Card.Body>
              {error && <Alert variant="danger" onClose={() => setError("")} dismissible>{error}</Alert>}
              {success && <Alert variant="success" onClose={() => setSuccess("")} dismissible>{success}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col md={6}>
                    <FloatingLabel controlId="kategori_id" label="Kategori Kos" className="mb-3">
                      <Form.Select
                        name="kategori_id"
                        value={formData.kategori_id}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Pilih Kategori</option>
                        {categories.map((kategori) => (
                          <option key={kategori.id} value={kategori.id}>
                            {kategori.name || kategori.nama_kategori}
                          </option>
                        ))}
                      </Form.Select>
                    </FloatingLabel>
                  </Col>
                  <Col md={6}>
                    <FloatingLabel controlId="name" label="Nama Kosan" className="mb-3">
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder=" "
                        required
                      />
                    </FloatingLabel>
                  </Col>
                </Row>

                <FloatingLabel controlId="location" label="Alamat Lengkap" className="mb-3">
                  <Form.Control
                    as="textarea"
                    style={{ height: '100px' }}
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder=" "
                    required
                  />
                </FloatingLabel>

                <FloatingLabel controlId="description" label="Deskripsi Fasilitas" className="mb-3">
                  <Form.Control
                    as="textarea"
                    style={{ height: '100px' }}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder=" "
                  />
                </FloatingLabel>

                <Row className="mb-3">
                  <Col md={6}>
                    <FloatingLabel controlId="jumlah_kamar" label="Jumlah Kamar Tersedia" className="mb-3">
                      <Form.Control
                        type="number"
                        name="jumlah_kamar"
                        min="1"
                        value={formData.jumlah_kamar}
                        onChange={handleChange}
                        placeholder=" "
                        required
                      />
                    </FloatingLabel>
                  </Col>
                  <Col md={6}>
                    <FloatingLabel controlId="price" label="Harga per Bulan (Rp)" className="mb-3">
                      <Form.Control
                        type="number"
                        name="price"
                        min="0"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder=" "
                        required
                      />
                    </FloatingLabel>
                  </Col>
                </Row>

                <Form.Group controlId="galeri" className="mb-4">
                  <Form.Label>Upload Foto Kos (Maksimal 5 foto)</Form.Label>
                  <Form.Control
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    max={5}
                  />
                  <Form.Text muted>
                    Unggah foto tampak depan dan fasilitas kos Anda
                  </Form.Text>
                </Form.Group>

                <div className="d-grid gap-2">
                  <Button 
                    variant="primary" 
                    size="lg" 
                    type="submit" 
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                        <span className="ms-2">Memproses...</span>
                      </>
                    ) : (
                      "Simpan Data Kos"
                    )}
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AddKos;