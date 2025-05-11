import React, { useState, useEffect } from "react";
import { Container, Table, Badge, Card, Alert, Spinner } from "react-bootstrap";
import { API } from "../../api/config";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOwnerPayments();
  }, []);

  const fetchOwnerPayments = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await API.get("/db.json");

      // Get kos owned by this owner
      const ownerKos = response.data.kos.filter(
        (kos) => kos.pemilikId.toString() === userId
      );
      const kosIds = ownerKos.map((kos) => kos.id);

      // Get bookings for owner's kos
      const relevantBookings = response.data.bookings.filter((booking) =>
        kosIds.includes(booking.kosId)
      );
      const bookingIds = relevantBookings.map((booking) => booking.id);

      // Filter and enrich payment data
      const ownerPayments = await Promise.all(
        response.data.payments
          .filter((payment) => bookingIds.includes(payment.bookingId))
          .map(async (payment) => {
            const booking = relevantBookings.find(
              (b) => b.id === payment.bookingId
            );
            const kos = ownerKos.find((k) => k.id === booking.kosId);
            const user = response.data.users.find(
              (u) => u.id === booking.userId
            );

            return {
              ...payment,
              kosName: kos.name,
              userName: user?.name || "Unknown",
              bookingDate: booking.startDate,
              duration: booking.duration,
            };
          })
      );

      setPayments(ownerPayments);
    } catch (error) {
      setError("Failed to load payment history");
    } finally {
      setLoading(false);
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
          <h2 className="mb-4">Riwayat Pembayaran</h2>
          {error && <Alert variant="danger">{error}</Alert>}

          {payments.length === 0 ? (
            <Alert variant="info">Tidak ada riwayat pembayaran</Alert>
          ) : (
            <Table responsive striped>
              <thead>
                <tr>
                  <th>Tanggal</th>
                  <th>Kos</th>
                  <th>Penyewa</th>
                  <th>Durasi</th>
                  <th>Jumlah</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id}>
                    <td>
                      {new Date(payment.bookingDate).toLocaleDateString()}
                    </td>
                    <td>{payment.kosName}</td>
                    <td>{payment.userName}</td>
                    <td>{payment.duration} bulan</td>
                    <td>Rp {payment.amount?.toLocaleString("id-ID")}</td>
                    <td>
                      <Badge
                        bg={
                          payment.status === "confirmed" ? "success" : "warning"
                        }
                      >
                        {payment.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PaymentHistory;
