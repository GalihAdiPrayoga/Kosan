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
import { FaCheck, FaTimes, FaSpinner } from "react-icons/fa";

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
    <Container fluid className="py-4 px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold">Kelola Booking</h2>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
          {bookings.length === 0 ? (
            <div className="text-center py-5">
              <div className="d-flex flex-column align-items-center">
                <div className="mb-3">
                  <FaSpinner
                    size={64}
                    className="text-muted"
                    style={{ opacity: 0.5 }}
                  />
                </div>
                <div>
                  <h5 className="text-muted mb-1">Belum Ada Booking</h5>
                  <p
                    className="text-muted mb-0"
                    style={{ fontSize: "0.9rem" }}
                  >
                    Tidak ada data booking yang tersedia saat ini
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <Table hover className="mb-0">
              <thead>
                <tr className="bg-light">
                  <th className="py-3 px-2" style={{ width: "5%" }}>
                    No
                  </th>
                  <th className="py-3 px-2" style={{ width: "20%" }}>
                    Kos
                  </th>
                  <th className="py-3 px-2" style={{ width: "15%" }}>
                    Pemesan
                  </th>
                  <th className="py-3 px-2" style={{ width: "15%" }}>
                    No. Telepon
                  </th>
                  <th className="py-3 px-2" style={{ width: "12%" }}>
                    Tanggal Mulai
                  </th>
                  <th className="py-3 px-2" style={{ width: "10%" }}>
                    Durasi
                  </th>
                  <th className="py-3 px-2" style={{ width: "13%" }}>
                    Total Harga
                  </th>
                  <th className="py-3 px-2" style={{ width: "10%" }}>
                    Status
                  </th>
                  <th className="py-3 px-2" style={{ width: "15%" }}>
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((booking, index) => (
                  <tr key={booking.id} className="align-middle">
                    <td className="py-3 px-2">{index + 1}</td>
                    <td className="py-3 px-2">
                      <div className="text-truncate fw-medium">
                        {booking.kosName}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="text-truncate">{booking.userName}</div>
                    </td>
                    <td className="py-3 px-2">
                      <div className="text-truncate">
                        {booking.userPhone || "-"}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      {new Date(booking.startDate).toLocaleDateString("id-ID")}
                    </td>
                    <td className="py-3 px-2">
                      <span className="fw-medium">
                        {booking.durasi_sewa} bulan
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span className="fw-medium">
                        Rp{" "}
                        {new Intl.NumberFormat("id-ID").format(booking.total_harga)}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <span
                        className={`badge bg-${
                          booking.status === "confirmed"
                            ? "success"
                            : booking.status === "pending"
                            ? "warning"
                            : "danger"
                        }`}
                      >
                        {booking.status === "confirmed"
                          ? "Dikonfirmasi"
                          : booking.status === "pending"
                          ? "Menunggu"
                          : "Ditolak"}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      {booking.status === "pending" && (
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(booking.id, "confirmed")
                            }
                            disabled={booking.paymentStatus !== "completed"}
                            title="Terima"
                          >
                            <FaCheck />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(booking.id, "rejected")
                            }
                            title="Tolak"
                          >
                            <FaTimes />
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
