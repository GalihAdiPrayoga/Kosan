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
  FloatingLabel,
} from "react-bootstrap";
import { API } from "../../api/config";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const AddKos = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    user_id: "",
    kategori_id: "",
    name: "",
    location: "",
    description: "",
    jumlah_kamar: 1,
    price: "",
    facilities: [], 
  });
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [facilities, setFacilities] = useState([]); // Array for facility data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesResponse, facilitiesResponse] = await Promise.all([
          API.get("/kategoris"),
          API.get("/fasilitas"),
        ]);

        if (categoriesResponse.data) {
          setCategories(
            Array.isArray(categoriesResponse.data)
              ? categoriesResponse.data
              : []
          );
        }

        if (facilitiesResponse.data) {
          setFacilities(
            Array.isArray(facilitiesResponse.data)
              ? facilitiesResponse.data
              : []
          );
        }
      } catch (err) {
        console.error(
          "Error fetching data:",
          err.response?.data || err.message
        );
        setError(
          "Gagal mengambil data: " +
            (err.response?.data?.message || err.message)
        );
      }
    };

    fetchData();

    const userId = localStorage.getItem("userId");
    if (userId) {
      setFormData((prevState) => ({ ...prevState, user_id: userId }));
    } else {
      setError("User belum login. Silakan login terlebih dahulu.");
    }

    // Cleanup function
    return () => {
      // Clean up all preview URLs when component unmounts
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, []);

  // Replace the existing handleFileChange function
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // Check number of files
    if (files.length + uploadedImages.length > 5) {
      setError("Maksimal 5 foto yang dapat diunggah");
      return;
    }

    // Validate each file
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFacilityChange = (facilityId) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facilityId)
        ? prev.facilities.filter((id) => id !== facilityId)
        : [...prev.facilities, facilityId],
    }));
  };

  // Update the handleSubmit function to properly handle image uploads
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

    uploadedImages.forEach((image, index) => {
      formDataToSend.append(`galeri[]`, image);
    });

    formData.facilities.forEach((facilityId) => {
      formDataToSend.append("fasilitas[]", facilityId);
    });

    try {
      const response = await API.post("/kosans", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Kos berhasil ditambahkan!",
          timer: 1500,
          showConfirmButton: false,
        });

        setTimeout(() => {
          navigate("/pemilik/kos");
        }, 1500);

        setFormData({
          user_id: formData.user_id,
          kategori_id: "",
          name: "",
          location: "",
          description: "",
          jumlah_kamar: 1,
          price: 0,
          facilities: [],
        });
        setUploadedImages([]);
        setImagePreviews([]);
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Gagal menambahkan kos.",
        });
      }
    } catch (err) {
      console.error("Error adding kos:", err);
      Swal.fire({
        icon: "error",
        title: "Terjadi Kesalahan",
        text:
          err.response?.data?.message || "Terjadi kesalahan saat menambah kos",
      });
    } finally {
      setLoading(false);
    }
  };

  // Add this new function
  const removeImage = (index) => {
    URL.revokeObjectURL(imagePreviews[index]); // Clean up URL object
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
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
              {error && (
                <Alert
                  variant="danger"
                  onClose={() => setError("")}
                  dismissible
                >
                  {error}
                </Alert>
              )}
              {success && (
                <Alert
                  variant="success"
                  onClose={() => setSuccess("")}
                  dismissible
                >
                  {success}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <Row className="mb-3">
                  <Col md={6}>
                    <FloatingLabel
                      controlId="kategori_id"
                      label="Kategori Kos"
                      className="mb-3"
                    >
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
                    <FloatingLabel
                      controlId="name"
                      label="Nama Kosan"
                      className="mb-3"
                    >
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

                <FloatingLabel
                  controlId="location"
                  label="Alamat Lengkap"
                  className="mb-3"
                >
                  <Form.Control
                    as="textarea"
                    style={{ height: "100px" }}
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder=" "
                    required
                  />
                </FloatingLabel>

                <FloatingLabel
                  controlId="description"
                  label="Deskripsi"
                  className="mb-3"
                >
                  <Form.Control
                    as="textarea"
                    style={{ height: "100px" }}
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder=" "
                  />
                </FloatingLabel>

                {/* Add this facilities section */}
                <Form.Group className="mb-3">
                  <Form.Label>Fasilitas Kos</Form.Label>
                  <Row className="g-3">
                    {facilities.map((facility) => (
                      <Col md={4} key={facility.id}>
                        <Form.Check
                          type="checkbox"
                          id={`facility-${facility.id}`}
                          label={
                            <span>
                              <i className={`fas ${facility.icon} me-2`}></i>
                              {facility.nama_fasilitas}
                            </span>
                          }
                          checked={formData.facilities.includes(facility.id)}
                          onChange={() => handleFacilityChange(facility.id)}
                          disabled={loading}
                        />
                      </Col>
                    ))}
                  </Row>
                </Form.Group>

                <Row className="mb-3">
                  <Col md={6}>
                    <FloatingLabel
                      controlId="jumlah_kamar"
                      label="Jumlah Kamar Tersedia"
                      className="mb-3"
                    >
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
                    <FloatingLabel
                      controlId="price"
                      label="Harga per Bulan (Rp)"
                      className="mb-3"
                    >
                      <Form.Control
                        type="number"
                        name="price"
                        min="0"
                        step="100000" // hanya kelipatan 100000
                        value={formData.price}
                        onChange={handleChange}
                        placeholder=" "
                        required
                      />
                    </FloatingLabel>
                  </Col>
                </Row>

                <Form.Group controlId="galeri" className="mb-4">
                  <Form.Label>Upload Foto Kos</Form.Label>
                  <div className="mb-2">
                    <small className="text-muted">
                      Format yang didukung: JPG, JPEG, PNG (Maks. 2MB per foto)
                    </small>
                  </div>
                  <Form.Control
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    max={5}
                  />

                  {imagePreviews.length > 0 && (
                    <div className="mt-3">
                      <Row className="g-2">
                        {imagePreviews.map((preview, index) => (
                          <Col key={index} xs={6} md={4} lg={3}>
                            <Card className="position-relative h-100">
                              <div
                                style={{
                                  width: "100%",
                                  paddingTop: "75%" /* 4:3 Aspect Ratio */,
                                  position: "relative",
                                }}
                              >
                                <img
                                  src={preview}
                                  alt={`Preview ${index + 1}`}
                                  style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                  }}
                                />
                              </div>
                              {/* Hapus Button removeImage di dalam Card */}
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    </div>
                  )}
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
                        <Spinner
                          as="span"
                          animation="border"
                          size="sm"
                          role="status"
                          aria-hidden="true"
                        />
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
