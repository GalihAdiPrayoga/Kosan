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
import {
  FaHome,
  FaBed,
  FaMoneyBillWave,
  FaImages,
  FaList,
} from "react-icons/fa";

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
    facilities: [], // Array for facility IDs
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

    // Append each image to FormData
    uploadedImages.forEach((image, index) => {
      formDataToSend.append(`galeri[]`, image);
    });

    // Add facilities
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
        setSuccess("Kos berhasil ditambahkan!");

        // Add slight delay before redirect
        setTimeout(() => {
          navigate("/pemilik/kos"); // Redirect to ManageKos page
        }, 1500);

        // Reset form
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
        setError("Gagal menambahkan kos.");
      }
    } catch (err) {
      console.error("Error adding kos:", err);
      setError(
        err.response?.data?.message || "Terjadi kesalahan saat menambah kos"
      );
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
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow border-0 rounded-lg overflow-hidden">
            <div
              className="text-white p-4"
              style={{
                background: "linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)",
              }}
            >
              <h2 className="mb-2 d-flex align-items-center gap-2">
                <FaHome /> Tambah Kos Baru
              </h2>
              <p className="mb-0 opacity-75">
                Isi informasi detail tentang kos Anda
              </p>
            </div>

            <Card.Body className="p-4">
              {error && (
                <Alert
                  variant="danger"
                  onClose={() => setError("")}
                  dismissible
                  className="animate__animated animate__fadeIn"
                >
                  {error}
                </Alert>
              )}
              {success && (
                <Alert
                  variant="success"
                  onClose={() => setSuccess("")}
                  dismissible
                  className="animate__animated animate__fadeIn"
                >
                  {success}
                </Alert>
              )}

              <Form onSubmit={handleSubmit}>
                <div className="mb-4 p-3 bg-light rounded-3">
                  <h5 className="mb-3 d-flex align-items-center gap-2">
                    <FaList /> Informasi Dasar
                  </h5>
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
                          className="border-0 shadow-sm"
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
                          className="border-0 shadow-sm"
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
                      className="border-0 shadow-sm"
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
                      className="border-0 shadow-sm"
                    />
                  </FloatingLabel>
                </div>

                <div className="mb-4 p-3 bg-light rounded-3">
                  <h5 className="mb-3 d-flex align-items-center gap-2">
                    <FaBed /> Fasilitas dan Kamar
                  </h5>
                  <Form.Group className="mb-4">
                    <Row className="g-3">
                      {facilities.map((facility) => (
                        <Col md={4} key={facility.id}>
                          <div
                            className={`p-3 rounded-3 shadow-sm ${
                              formData.facilities.includes(facility.id)
                                ? "bg-primary bg-opacity-10"
                                : "bg-white"
                            }`}
                          >
                            <Form.Check
                              type="checkbox"
                              id={`facility-${facility.id}`}
                              label={
                                <span className="d-flex align-items-center gap-2">
                                  <i className={`fas ${facility.icon}`}></i>
                                  {facility.nama_fasilitas}
                                </span>
                              }
                              checked={formData.facilities.includes(
                                facility.id
                              )}
                              onChange={() => handleFacilityChange(facility.id)}
                              disabled={loading}
                            />
                          </div>
                        </Col>
                      ))}
                    </Row>
                  </Form.Group>

                  <Row>
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
                          className="border-0 shadow-sm"
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
                          value={formData.price}
                          onChange={handleChange}
                          placeholder=" "
                          required
                          className="border-0 shadow-sm"
                        />
                      </FloatingLabel>
                    </Col>
                  </Row>
                </div>

                <div className="mb-4 p-3 bg-light rounded-3">
                  <h5 className="mb-3 d-flex align-items-center gap-2">
                    <FaImages /> Galeri Foto
                  </h5>
                  <Form.Group controlId="galeri">
                    <div className="mb-3">
                      <div className="p-3 border border-dashed rounded-3 text-center">
                        <Form.Control
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleFileChange}
                          max={5}
                          className="d-none"
                          id="file-upload"
                        />
                        <label
                          htmlFor="file-upload"
                          className="btn btn-outline-primary mb-2"
                        >
                          <FaImages className="me-2" />
                          Pilih Foto
                        </label>
                        <div className="text-muted small">
                          Format: JPG, JPEG, PNG (Maks. 2MB per foto)
                        </div>
                      </div>
                    </div>

                    {imagePreviews.length > 0 && (
                      <Row className="g-2">
                        {imagePreviews.map((preview, index) => (
                          <Col key={index} xs={6} md={4} lg={3}>
                            <Card className="position-relative h-100 border-0 shadow-sm">
                              <div style={{ paddingTop: "75%" }}>
                                <img
                                  src={preview}
                                  alt={`Preview ${index + 1}`}
                                  className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover rounded"
                                />
                              </div>
                              <Button
                                variant="danger"
                                size="sm"
                                className="position-absolute top-0 end-0 m-1 rounded-circle p-0"
                                onClick={() => removeImage(index)}
                                style={{ width: "24px", height: "24px" }}
                              >
                                ×
                              </Button>
                            </Card>
                          </Col>
                        ))}
                      </Row>
                    )}
                  </Form.Group>
                </div>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    size="lg"
                    type="submit"
                    disabled={loading}
                    className="rounded-pill"
                    style={{
                      background:
                        "linear-gradient(135deg, #0d6efd 0%, #0a58ca 100%)",
                    }}
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Memproses...
                      </>
                    ) : (
                      <>
                        <FaHome className="me-2" />
                        Simpan Data Kos
                      </>
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
