import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Alert,
  Spinner,
  Row,
  Col,
  Badge,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../../api/config";
import { getImageUrl } from "../../utils/imageUtils";

const EditKos = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [selectedFacilities, setSelectedFacilities] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [formData, setFormData] = useState({
    nama_kosan: "",
    alamat: "",
    deskripsi: "",
    harga_per_bulan: "",
    jumlah_kamar: "",
    kategori_id: "",
    galeri: [], // Pastikan galeri diinisialisasi sebagai array kosong
  });

  // Fetch kos data and initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [kosResponse, categoriesResponse, facilitiesResponse] =
          await Promise.all([
            API.get(`/kosans/${id}`),
            API.get("/kategoris"),
            API.get("/fasilitas"),
          ]);

        const kosData = kosResponse.data;

        setFormData({
          nama_kosan: kosData.nama_kosan || "",
          alamat: kosData.alamat || "",
          deskripsi: kosData.deskripsi || "",
          harga_per_bulan: kosData.harga_per_bulan?.toString() || "",
          jumlah_kamar: kosData.jumlah_kamar?.toString() || "",
          kategori_id: kosData.kategori_id?.toString() || "",
        });

        // Handle existing images
        if (kosData.galeri) {
          const images = Array.isArray(kosData.galeri)
            ? kosData.galeri
            : typeof kosData.galeri === "string"
            ? JSON.parse(kosData.galeri)
            : [];
          setExistingImages(images);
        }

        // Set selected facilities
        if (kosData.fasilitas) {
          setSelectedFacilities(kosData.fasilitas.map((f) => f.id));
        }

        setCategories(categoriesResponse.data);
        setFacilities(facilitiesResponse.data);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Gagal mengambil data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFacilityChange = (facilityId) => {
    setSelectedFacilities((prev) => {
      if (prev.includes(facilityId)) {
        return prev.filter((id) => id !== facilityId);
      }
      return [...prev, facilityId];
    });
  };

  // Perbaikan handleImageChange
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      galeri: prev.galeri ? [...prev.galeri, ...files] : [...files], // Tambahkan pengecekan
    }));

    // Create preview URLs
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Perbaikan handleRemoveImage
  const handleRemoveImage = (index, type) => {
    if (type === "new") {
      setPreviewImages((prev) => prev.filter((_, i) => i !== index));
      setFormData((prev) => ({
        ...prev,
        galeri: Array.isArray(prev.galeri)
          ? prev.galeri.filter((_, i) => i !== index)
          : [],
      }));
    } else {
      setExistingImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const formDataToSend = new FormData();

      // Append basic fields
      Object.keys(formData).forEach((key) => {
        if (key !== "galeri") {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append new images
      if (formData.galeri && formData.galeri.length > 0) {
        formData.galeri.forEach((file) => {
          formDataToSend.append("galeri[]", file);
        });
      }

      // Append existing images
      existingImages.forEach((image) => {
        formDataToSend.append("existing_images[]", image);
      });

      // Append facilities
      if (selectedFacilities.length > 0) {
        selectedFacilities.forEach((facilityId) => {
          formDataToSend.append("fasilitas[]", facilityId);
        });
      }

      const response = await API.post(
        `/kosans/${id}?_method=PUT`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      navigate("/pemilik/kos");
    } catch (err) {
      console.error("Error updating kos:", err);
      setError(err.response?.data?.message || "Gagal mengupdate data kos");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "60vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="mb-4">Edit Kos</h2>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Nama Kos</Form.Label>
                  <Form.Control
                    type="text"
                    name="nama_kosan"
                    value={formData.nama_kosan}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Kategori</Form.Label>
                  <Form.Select
                    name="kategori_id"
                    value={formData.kategori_id}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Pilih Kategori</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.nama_kategori}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Alamat</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                name="alamat"
                value={formData.alamat}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Deskripsi</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="deskripsi"
                value={formData.deskripsi}
                onChange={handleInputChange}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Harga per Bulan</Form.Label>
                  <Form.Control
                    type="number"
                    name="harga_per_bulan"
                    value={formData.harga_per_bulan}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Jumlah Kamar</Form.Label>
                  <Form.Control
                    type="number"
                    name="jumlah_kamar"
                    value={formData.jumlah_kamar}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Fasilitas</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {facilities.map((facility) => (
                  <Badge
                    key={facility.id}
                    bg={
                      selectedFacilities.includes(facility.id)
                        ? "primary"
                        : "light"
                    }
                    text={
                      selectedFacilities.includes(facility.id)
                        ? "white"
                        : "dark"
                    }
                    style={{ cursor: "pointer" }}
                    onClick={() => handleFacilityChange(facility.id)}
                  >
                    {facility.nama_fasilitas}
                  </Badge>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-4">
              <Form.Label>Galeri Foto</Form.Label>

              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-3">
                  <p className="text-muted small">Foto yang sudah ada:</p>
                  <div className="d-flex flex-wrap gap-2">
                    {existingImages.map((image, index) => (
                      <div key={index} className="position-relative">
                        <img
                          src={getImageUrl(image)}
                          alt={`Existing ${index + 1}`}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                          className="rounded"
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0"
                          onClick={() => handleRemoveImage(index, "existing")}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* New Images Preview */}
              {previewImages.length > 0 && (
                <div className="mb-3">
                  <p className="text-muted small">Foto baru:</p>
                  <div className="d-flex flex-wrap gap-2">
                    {previewImages.map((preview, index) => (
                      <div key={index} className="position-relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                          }}
                          className="rounded"
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0"
                          onClick={() => handleRemoveImage(index, "new")}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Form.Control
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
              />
              <Form.Text className="text-muted">
                Pilih beberapa foto sekaligus. Format: JPG, PNG (Max: 2MB per
                foto)
              </Form.Text>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan Perubahan"
                )}
              </Button>
              <Button
                variant="outline-secondary"
                onClick={() => navigate("/pemilik/kos")}
              >
                Batal
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditKos;
