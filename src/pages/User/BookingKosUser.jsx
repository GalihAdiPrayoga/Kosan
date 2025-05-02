import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Button,
  Alert,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const BookingKosUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

  // Add useEffect to check login status
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login", {
        replace: true,
        state: {
          from: `/booking/${id}`,
          message: "Silakan login terlebih dahulu untuk melakukan pemesanan",
        },
      });
    }
  }, [isLoggedIn, navigate, id]);

  // If not logged in, don't render the form
  if (!isLoggedIn) {
    return (
      <Container className="py-5">
        <Alert variant="warning">
          Anda harus login terlebih dahulu untuk melakukan pemesanan.
        </Alert>
      </Container>
    );
  }

  const [bookingData, setBookingData] = useState({
    startDate: "",
    duration: "1",
    name: "",
    phone: "",
    occupation: "",
    identityNumber: "",
  });

  // Dummy kos data - replace with actual data fetching
  const kosDetail = {
    id: id,
    name: "Kos Melati",
    location: "Jakarta Selatan",
    price: 1500000,
    type: "Putri",
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBookingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your booking logic here
    console.log("Booking data:", bookingData);
    // Redirect to payment page after successful booking
    navigate("/payment");
  };

  const calculateTotal = () => {
    return kosDetail.price * parseInt(bookingData.duration);
  };

  return (
    <Container className="py-5">
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <h4 className="mb-4">Form Pemesanan</h4>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tanggal Mulai</Form.Label>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={bookingData.startDate}
                        onChange={handleInputChange}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Durasi Sewa (Bulan)</Form.Label>
                      <Form.Select
                        name="duration"
                        value={bookingData.duration}
                        onChange={handleInputChange}
                        required
                      >
                        {[1, 3, 6, 12].map((month) => (
                          <option key={month} value={month}>
                            {month} Bulan
                          </option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Nama Lengkap</Form.Label>
                  <Form.Control
                    type="text"
                    name="name"
                    value={bookingData.name}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Nomor Telepon</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    value={bookingData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Pekerjaan</Form.Label>
                  <Form.Control
                    type="text"
                    name="occupation"
                    value={bookingData.occupation}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Nomor KTP</Form.Label>
                  <Form.Control
                    type="text"
                    name="identityNumber"
                    value={bookingData.identityNumber}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Lanjut ke Pembayaran
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="sticky-top" style={{ top: "20px" }}>
            <Card.Body>
              <h5>Detail Pemesanan</h5>
              <hr />
              <p>
                <strong>{kosDetail.name}</strong>
                <br />
                {kosDetail.location}
                <br />
                Tipe: {kosDetail.type}
              </p>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Harga per bulan:</span>
                <span>
                  Rp {new Intl.NumberFormat("id-ID").format(kosDetail.price)}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Durasi:</span>
                <span>{bookingData.duration} Bulan</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total:</strong>
                <strong>
                  Rp {new Intl.NumberFormat("id-ID").format(calculateTotal())}
                </strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingKosUser;
