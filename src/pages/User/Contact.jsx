import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import {
  FaPhone,
  FaEnvelope,
  FaMapMarkerAlt,
  FaWhatsapp,
} from "react-icons/fa";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState({ type: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Here you would typically send the form data to your backend
    setStatus({
      type: "success",
      message: "Pesan Anda telah terkirim. Kami akan segera menghubungi Anda.",
    });
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const contactInfo = [
    {
      icon: <FaPhone className="text-primary" size={24} />,
      title: "Telepon",
      content: "(021) 1234-5678",
      link: "tel:+622112345678",
    },
    {
      icon: <FaWhatsapp className="text-primary" size={24} />,
      title: "WhatsApp",
      content: "+62 812-3456-7890",
      link: "https://wa.me/6281234567890",
    },
    {
      icon: <FaEnvelope className="text-primary" size={24} />,
      title: "Email",
      content: "info@kosapp.com",
      link: "mailto:info@kosapp.com",
    },
    {
      icon: <FaMapMarkerAlt className="text-primary" size={24} />,
      title: "Alamat",
      content: "Jl. Example No. 123, Jakarta",
      link: "https://maps.google.com",
    },
  ];

  return (
    <div className="bg-light min-vh-100">
      <Container className="py-5">
        {/* Hero Section */}
        <Row className="justify-content-center mb-5">
          <Col md={8} className="text-center">
            <h1 className="display-4 fw-bold mb-4">Hubungi Kami</h1>
            <p className="lead text-muted">
              Kami siap membantu Anda 24/7. Silakan hubungi kami melalui form di
              bawah ini atau melalui kontak yang tersedia.
            </p>
          </Col>
        </Row>

        {/* Contact Info Cards */}
        <Row className="justify-content-center mb-5">
          {contactInfo.map((info, index) => (
            <Col key={index} md={3} sm={6} className="mb-4">
              <Card className="h-100 border-0 shadow-sm hover-shadow transition-all">
                <Card.Body className="text-center p-4">
                  <div className="mb-3">{info.icon}</div>
                  <h5 className="fw-bold mb-2">{info.title}</h5>
                  <a
                    href={info.link}
                    className="text-decoration-none text-muted"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {info.content}
                  </a>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Contact Form */}
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="border-0 shadow">
              <Card.Body className="p-5">
                <h3 className="text-center mb-4">Kirim Pesan</h3>

                {status.message && (
                  <Alert
                    variant={status.type === "success" ? "success" : "danger"}
                    className="mb-4"
                  >
                    {status.message}
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">Nama</Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="py-2"
                          placeholder="Masukkan nama lengkap"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-semibold">Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="py-2"
                          placeholder="Masukkan alamat email"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Subjek</Form.Label>
                    <Form.Control
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="py-2"
                      placeholder="Masukkan subjek pesan"
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">Pesan</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={5}
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      className="py-2"
                      placeholder="Tulis pesan Anda di sini..."
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-100 py-3"
                  >
                    Kirim Pesan
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Contact;
