import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const PaymentUser = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("transfer");

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add payment processing logic here
    console.log("Payment processed:", paymentMethod);
    navigate("/");
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <h3 className="mb-4">Pembayaran</h3>

              <div className="mb-4">
                <h5>Total Pembayaran</h5>
                <h3 className="text-primary">Rp 1.500.000</h3>
              </div>

              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-4">
                  <Form.Label>Metode Pembayaran</Form.Label>
                  <div>
                    <Form.Check
                      type="radio"
                      label="Transfer Bank"
                      name="paymentMethod"
                      value="transfer"
                      checked={paymentMethod === "transfer"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="mb-2"
                    />
                    <Form.Check
                      type="radio"
                      label="QRIS"
                      name="paymentMethod"
                      value="qris"
                      checked={paymentMethod === "qris"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                  </div>
                </Form.Group>

                {paymentMethod === "transfer" && (
                  <div className="mb-4">
                    <h6>Informasi Transfer</h6>
                    <p>
                      Bank BCA
                      <br />
                      1234567890
                      <br />
                      a.n. KosApp
                    </p>
                  </div>
                )}

                {paymentMethod === "qris" && (
                  <div className="mb-4">
                    <h6>Scan QRIS</h6>
                    <img
                      src="/qris-example.png"
                      alt="QRIS Code"
                      style={{ maxWidth: "200px" }}
                      className="d-block mx-auto"
                    />
                  </div>
                )}

                <Form.Group className="mb-4">
                  <Form.Label>Upload Bukti Pembayaran</Form.Label>
                  <Form.Control type="file" accept="image/*" required />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Konfirmasi Pembayaran
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentUser;
