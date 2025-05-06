import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Spinner,
  Alert,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../../api/config";

const EditKos = () => {
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
  const [existingImages, setExistingImages] = useState([]);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);

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

  useEffect(() => {
    fetchKosDetail();
  }, [id]);

  const fetchKosDetail = async () => {
    try {
      const response = await API.get(`/kos/${id}`);
      const kosData = response.data;
      
      // Verify ownership
      const userId = localStorage.getItem("userId");
      if (kosData.pemilikId.toString() !== userId) {
        throw new Error("Anda tidak memiliki akses ke kos ini");
      }

      setFormData({
        name: kosData.name,
        location: kosData.location,
        price: kosData.price,
        type: kosData.type,
        description: kosData.description,
        facilities: kosData.facilities || [],
        rules: kosData.rules || [],
      });

      setExistingImages(kosData.images || []);
      setLoading(false);
    } catch (err) {
      setError(err.message || "Gagal memuat data kos");
      setLoading(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setUploadedImages([...uploadedImages, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreview([...imagePreview, ...newPreviews]);
  };

  const removeExistingImage = (index) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setUploadedImages(uploadedImages.filter((_, i) => i !== index));
    setImagePreview(imagePreview.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "facilities" || key === "rules") {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      formDataToSend.append("existingImages", JSON.stringify(existingImages));
      uploadedImages.forEach((image) => {
        formDataToSend.append("newImages", image);
      });

      await API.put(`/kos/${id}`, formDataToSend);
      navigate("/pemilik/kos");
    } catch (err) {
      setError(err.message || "Gagal mengupdate kos");
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

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
        <Button variant="secondary" onClick={() => navigate("/pemilik/kos")}>
          Kembali
        </Button>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="mb-4">Edit Kos</h2>

          <Form onSubmit={handleSubmit}>
            {/* Similar form structure as AddKos */}
            {/* Add your form fields here */}

            <div className="d-flex justify-content-end gap-2 mt-4">
              <Button variant="secondary" onClick={() => navigate("/pemilik/kos")}>
                Batal
              </Button>
              <Button type="submit" variant="primary">
                Simpan Perubahan
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditKos;
