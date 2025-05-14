import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Badge,
  Spinner,
  Button,
  Card,
  Alert,
} from "react-bootstrap";
import { API } from "../../api/config";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAcceptedPayments();
  }, []);

  const fetchAcceptedPayments = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await API.get(`/pembayarans/accepted/${userId}`);

      if (response.data.status === "success") {
        const payments = response.data.data.map((payment) => ({
          id: payment.id,
          kosName: payment.kosan?.nama_kosan || "Unknown Kos",
          userName: payment.user?.name || "Unknown User",
          userPhone: payment.user?.nomor || "",
          startDate: payment.tanggal_bayar,
          durasi_sewa: payment.durasi_sewa,
          total_harga: payment.total_harga,
          status: payment.status,
          bukti_pembayaran: payment.bukti_pembayaran,
        }));

        setBookings(payments);
      } else {
        throw new Error(response.data.message);
      }

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch payments");
      console.error("Error:", err);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await API.patch(`/bookings/${bookingId}`, { status: newStatus });
      fetchAcceptedPayments(); // Refresh the list
    } catch (err) {
      setError("Failed to update booking status");
      console.error("Failed to update booking status:", err);
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
          <h2 className="mb-4">Daftar Booking</h2>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          {bookings.length === 0 ? (
            <Alert variant="info">Belum ada booking</Alert>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>Kos</th>
                  <th>Pemesan</th>
                  <th>No. Telepon</th>
                  <th>Tanggal Mulai</th>
                  <th>Durasi</th>
                  <th>Total Harga</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.kosName}</td>
                    <td>{booking.userName}</td>
                    <td>{booking.userPhone}</td>
                    <td>
                      {new Date(booking.startDate).toLocaleDateString("id-ID")}
                    </td>
                    <td>{booking.durasi_sewa} bulan</td>
                    <td>
                      Rp{" "}
                      {new Intl.NumberFormat("id-ID").format(
                        booking.total_harga
                      )}
                    </td>
                    <td>
                      <Badge
                        bg={
                          booking.status === "confirmed"
                            ? "success"
                            : booking.status === "pending"
                            ? "warning"
                            : "danger"
                        }
                      >
                        {booking.status}
                      </Badge>
                    </td>
                    <td>
                      {booking.status === "pending" && (
                        <div className="d-flex gap-2">
                          <Button
                            variant="success"
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(booking.id, "confirmed")
                            }
                            disabled={booking.paymentStatus !== "completed"}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(booking.id, "rejected")
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      )}
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

export default BookingList;
