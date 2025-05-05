import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Badge,
  Spinner,
  Button,
  Card,
} from "react-bootstrap";
import { API } from "../../api/config";

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const response = await API.get("/db.json");

      // Filter bookings for owner's kos
      const ownerKos = response.data.kos.filter(
        (kos) => kos.adminId.toString() === userId
      );
      const kosIds = ownerKos.map((kos) => kos.id);

      const ownerBookings = response.data.bookings.filter((booking) =>
        kosIds.includes(booking.kosId)
      );

      setBookings(ownerBookings);
      setLoading(false);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await API.patch(`/bookings/${bookingId}`, { status: newStatus });
      fetchBookings(); // Refresh the list
    } catch (err) {
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

          <Table responsive hover>
            <thead>
              <tr>
                <th>Kos</th>
                <th>Pemesan</th>
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
                  <td>{new Date(booking.startDate).toLocaleDateString()}</td>
                  <td>{booking.duration} bulan</td>
                  <td>
                    Rp{" "}
                    {new Intl.NumberFormat("id-ID").format(booking.totalPrice)}
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
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BookingList;
