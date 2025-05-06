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
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await API.get("/db.json");
      
      // Filter kos owned by the current pemilik
      const ownerKos = response.data.kos.filter(
        (kos) => kos.pemilikId.toString() === userId
      );
      const kosIds = ownerKos.map((kos) => kos.id);

      // Get bookings for owner's kos
      const ownerBookings = response.data.bookings.filter((booking) =>
        kosIds.includes(booking.kosId)
      );

      // Enrich booking data with kos and user details
      const enrichedBookings = await Promise.all(
        ownerBookings.map(async (booking) => {
          const kos = ownerKos.find((k) => k.id === booking.kosId);
          const user = response.data.users.find((u) => u.id === booking.userId);
          const payment = response.data.payments.find(
            (p) => p.bookingId === parseInt(booking.id)
          );

          return {
            ...booking,
            kosName: kos?.name || "Unknown Kos",
            userName: user?.name || "Unknown User",
            userPhone: user?.phone || "-",
            paymentStatus: payment?.status || "pending",
          };
        })
      );

      setBookings(enrichedBookings);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch bookings");
      console.error("Failed to fetch bookings:", err);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await API.patch(`/bookings/${bookingId}`, { status: newStatus });
      fetchBookings(); // Refresh the list
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
          
          {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

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
                  <th>Status Booking</th>
                  <th>Status Pembayaran</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking) => (
                  <tr key={booking.id}>
                    <td>{booking.kosName}</td>
                    <td>{booking.userName}</td>
                    <td>{booking.userPhone}</td>
                    <td>{new Date(booking.startDate).toLocaleDateString("id-ID")}</td>
                    <td>{booking.duration} bulan</td>
                    <td>
                      Rp {new Intl.NumberFormat("id-ID").format(booking.totalPrice)}
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
                      <Badge
                        bg={
                          booking.paymentStatus === "completed"
                            ? "success"
                            : "warning"
                        }
                      >
                        {booking.paymentStatus}
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
