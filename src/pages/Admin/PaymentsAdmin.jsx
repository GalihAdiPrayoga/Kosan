import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Badge,
  Card,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { API } from "../../api/config";

const PaymentsAdmin = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await API.get("/db.json");

      // Get all payments with related data
      const enrichedPayments = await Promise.all(
        response.data.payments.map(async (payment) => {
          const booking = response.data.bookings.find(
            (b) => b.id === payment.bookingId
          );
          const user = response.data.users.find(
            (u) => u.id === booking?.userId
          );
          const kos = response.data.kos.find((k) => k.id === booking?.kosId);

          return {
            ...payment,
            userName: user?.name || "Unknown",
            kosName: kos?.name || "Unknown",
            bookingDate: booking?.startDate,
            duration: booking?.duration,
          };
        })
      );

      setPayments(enrichedPayments);
    } catch (error) {
      setError("Failed to load payments");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirmPayment = async (paymentId) => {
    try {
      await API.patch(`/payments/${paymentId}`, { status: "confirmed" });
      fetchPayments();
    } catch (error) {
      setError("Failed to confirm payment");
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

  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="mb-4">Manajemen Pembayaran</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          <Table responsive striped hover>
            <thead>
              <tr>
                <th>ID Pembayaran</th>
                <th>Nama Penyewa</th>
                <th>Nama Kos</th>
                <th>Jumlah</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{payment.userName}</td>
                  <td>{payment.kosName}</td>
                  <td>Rp {payment.amount?.toLocaleString("id-ID")}</td>
                  <td>{new Date(payment.bookingDate).toLocaleDateString()}</td>
                  <td>
                    <Badge
                      bg={
                        payment.status === "confirmed" ? "success" : "warning"
                      }
                    >
                      {payment.status}
                    </Badge>
                  </td>
                  <td>
                    {payment.status === "pending" && (
                      <Button
                        variant="success"
                        size="sm"
                        onClick={() => handleConfirmPayment(payment.id)}
                      >
                        Konfirmasi
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PaymentsAdmin;
