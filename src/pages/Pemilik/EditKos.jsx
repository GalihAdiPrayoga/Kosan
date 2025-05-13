import React, { useState, useEffect } from "react";
import { Form, Button, Card, Alert, Row, Col } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../../api/config";
import { getImageUrl } from "../../utils/imageUtils";

const EditKos = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
    jumlah_kamar: 1,
    price: "",
    kategori_id: "",
    facilities: [], // Array untuk menyimpan ID fasilitas
  });

  const [uploadedImages, setUploadedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [facilities, setFacilities] = useState([]); // Untuk list fasilitas dari API
  const [categories, setCategories] = useState([]); // Untuk list kategori dari API
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchKosDetail();
    fetchFacilities();
    fetchCategories();
  }, [id]);

  const fetchKosDetail = async () => {
    try {
      const response = await API.get(`/kosans/${id}`);
      const kosData = response.data.data;

      setFormData({
        name: kosData.nama_kosan,
        location: kosData.alamat,
        description: kosData.deskripsi,
        jumlah_kamar: kosData.jumlah_kamar,
        price: kosData.harga_per_bulan,
        kategori_id: kosData.kategori_id,
        facilities: kosData.fasilitas.map((f) => f.id), // Ambil ID fasilitas
      });

      // Set existing images
      if (kosData.galeri) {
        const images = Array.isArray(kosData.galeri)
          ? kosData.galeri
          : [kosData.galeri];
        setExistingImages(images);
      }
    } catch (err) {
      setError("Gagal mengambil data kos");
      console.error(err);
    }
  };

  const fetchFacilities = async () => {
    try {
      const response = await API.get("/fasilitas");
      setFacilities(response.data.data);
    } catch (err) {
      console.error("Gagal mengambil data fasilitas:", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await API.get("/kategori");
      setCategories(response.data.data);
    } catch (err) {
      console.error("Gagal mengambil data kategori:", err);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + existingImages.length > 5) {
      setError("Maksimal 5 foto yang dapat diunggah");
      return;
    }

    const validFiles = files.filter((file) => {
      const isValidType = file.type.startsWith("image/");
      const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB limit
      return isValidType && isValidSize;
    });

    if (validFiles.length !== files.length) {
      setError(
        "Beberapa file tidak valid. Pastikan semua file adalah gambar dan ukuran maksimal 2MB"
      );
      return;
    }

    setUploadedImages((prev) => [...prev, ...validFiles]);

    // Create preview URLs
    const newPreviews = validFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("nama_kosan", formData.name);
      formDataToSend.append("alamat", formData.location);
      formDataToSend.append("deskripsi", formData.description);
      formDataToSend.append("jumlah_kamar", formData.jumlah_kamar);
      formDataToSend.append("harga_per_bulan", formData.price);
      formDataToSend.append("kategori_id", formData.kategori_id);

      // Append facilities
      formData.facilities.forEach((facilityId) => {
        formDataToSend.append("fasilitas[]", facilityId);
      });

      // Append new images
      uploadedImages.forEach((image) => {
        formDataToSend.append("galeri[]", image);
      });

      // Append existing images
      existingImages.forEach((image) => {
        formDataToSend.append("existing_galeri[]", image);
      });

      const response = await API.post(
        `/kosans/${id}?_method=PUT`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        navigate("/pemilik/kos");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Gagal mengupdate kos");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Body>
        <h4 className="mb-4">Edit Kos</h4>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Row className="mb-4">
            <Col md={8}>
              <Form.Group controlId="kategori_id">
                <Form.Label>Kategori</Form.Label>
                <Form.Select
                  value={formData.kategori_id}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      kategori_id: e.target.value,
                    })
                  }
                  required
                >
                  <option value="">Pilih kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.nama_kategori}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <Form.Group controlId="nama_kosan">
                <Form.Label>Nama Kosan</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.nama_kosan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      nama_kosan: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>

              <Form.Group controlId="alamat">
                <Form.Label>Alamat</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.alamat}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      alamat: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>

              <Form.Group controlId="deskripsi">
                <Form.Label>Deskripsi</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  value={formData.deskripsi}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      deskripsi: e.target.value,
                    })
                  }
                  required
                />
              </Form.Group>

              <Form.Group controlId="jumlah_kamar">
                <Form.Label>Jumlah Kamar</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.jumlah_kamar}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      jumlah_kamar: e.target.value,
                    })
                  }
                  required
                  min={1}
                />
              </Form.Group>

              <Form.Group controlId="harga_per_bulan">
                <Form.Label>Harga per Bulan</Form.Label>
                <Form.Control
                  type="number"
                  value={formData.harga_per_bulan}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      harga_per_bulan: e.target.value,
                    })
                  }
                  required
                  min={0}
                />
              </Form.Group>

              <Form.Group controlId="facilities">
                <Form.Label>Fasilitas</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {facilities.map((facility) => (
                    <Form.Check
                      key={facility.id}
                      type="checkbox"
                      label={facility.nama_fasilitas}
                      checked={formData.facilities.includes(facility.id)}
                      onChange={() => {
                        const updated = formData.facilities.includes(
                          facility.id
                        )
                          ? formData.facilities.filter(
                              (id) => id !== facility.id
                            )
                          : [...formData.facilities, facility.id];
                        setFormData({ ...formData, facilities: updated });
                      }}
                    />
                  ))}
                </div>
              </Form.Group>
            </Col>

            <Col md={4}>
              <Form.Group className="mb-4">
                <Form.Label>Foto Kos (Maksimal 5 foto)</Form.Label>
                <div className="mb-3">
                  {existingImages.length > 0 && (
                    <div className="d-flex flex-wrap gap-2 mb-3">
                      {existingImages.map((image, index) => (
                        <div key={index} className="position-relative">
                          <img
                            src={getImageUrl(image)}
                            alt={`Existing ${index + 1}`}
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              borderRadius: "4px",
                            }}
                          />
                          <Button
                            variant="danger"
                            size="sm"
                            className="position-absolute top-0 end-0 m-1"
                            onClick={() => {
                              setExistingImages(
                                existingImages.filter((_, i) => i !== index)
                              );
                            }}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <Form.Control
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </div>

                {imagePreviews.length > 0 && (
                  <div className="d-flex flex-wrap gap-2">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="position-relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          style={{
                            width: "100px",
                            height: "100px",
                            objectFit: "cover",
                            borderRadius: "4px",
                          }}
                        />
                        <Button
                          variant="danger"
                          size="sm"
                          className="position-absolute top-0 end-0 m-1"
                          onClick={() => {
                            URL.revokeObjectURL(preview);
                            setImagePreviews(
                              imagePreviews.filter((_, i) => i !== index)
                            );
                            setUploadedImages(
                              uploadedImages.filter((_, i) => i !== index)
                            );
                          }}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </Form.Group>
            </Col>
          </Row>

          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default EditKos;
