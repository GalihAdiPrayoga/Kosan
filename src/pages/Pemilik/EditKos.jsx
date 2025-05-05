import React, { useState, useEffect } from "react";
import {
  Container,
  Form,
  Button,
  Card,
  Row,
  Col,
  Spinner,
} from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { API } from "../../api/config";

const EditKos = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState(null);

  useEffect(() => {
    fetchKosDetail();
  }, [id]);

  const fetchKosDetail = async () => {
    try {
      const response = await API.get(`/kos/${id}`);
      setFormData(response.data);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch kos detail:", err);
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/kos/${id}`, formData);
      navigate("/pemilik/kos");
    } catch (err) {
      console.error("Failed to update kos:", err);
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

  // Rest of the component is similar to AddKos
  // but with pre-filled values from formData
  return (
    <Container className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="mb-4">Edit Kos</h2>
          {/* Similar form structure as AddKos */}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EditKos;
