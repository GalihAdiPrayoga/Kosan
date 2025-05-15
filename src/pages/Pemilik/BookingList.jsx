import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Table,
  Badge,
  Spinner,
  Button,
  Card,
  Alert,
  Form,
  InputGroup,
  Row,
  Col,
} from "react-bootstrap";
import { FaSearch, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { API } from "../../api/config";
import notFoundImage from "../../assets/notfound.jpg";
import Swal from "sweetalert2";

const ITEMS_PER_PAGE = 5;

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [filters, setFilters] = useState({
    search: "",
  });

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

  const handleDelete = async (booking) => {
    const result = await Swal.fire({
      title: "Konfirmasi Hapus",
      html: `
      <div class="text-start">
        <p>Anda yakin ingin menghapus data pembayaran ini?</p>
        <div class="bg-light p-3 rounded">
          <p class="mb-1"><strong>Kos:</strong> ${booking.kosName}</p>
          <p class="mb-1"><strong>Pemesan:</strong> ${booking.userName}</p>
          <p class="mb-1"><strong>Total Harga:</strong> Rp ${new Intl.NumberFormat(
            "id-ID"
          ).format(booking.total_harga)}</p>
          <p class="mb-0"><strong>Status:</strong> ${booking.status}</p>
        </div>
      </div>
    `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, Hapus",
      cancelButtonText: "Batal",
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      try {
        const response = await API.delete(`/pembayarans/${booking.id}`);

        if (response.status === 200) {
          Swal.fire({
            title: "Berhasil!",
            text: "Data pembayaran berhasil dihapus",
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
          fetchAcceptedPayments();
        }
      } catch (err) {
        Swal.fire({
          title: "Error!",
          text: "Gagal menghapus pembayaran",
          icon: "error",
          confirmButtonColor: "#dc3545",
        });
        console.error("Failed to delete payment:", err);
      }
    }
  };

  const filteredBookings = useMemo(() => {
    return bookings.filter((booking) => {
      const searchMatch = filters.search.toLowerCase();

      const searchableFields = [
        booking.kosName,
        booking.userName,
        booking.userPhone,
        booking.total_harga.toString(),
      ].map((field) => field.toLowerCase());

      return (
        filters.search === "" ||
        searchableFields.some((field) => field.includes(searchMatch))
      );
    });
  }, [bookings, filters]);

  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const paginatedBookings = filteredBookings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredBookings.length / ITEMS_PER_PAGE);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Daftar Booking</h2>
          </div>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          <Row className="mb-4">
            <Col>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0">
                  <FaSearch className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  name="search"
                  className="border-start-0 bg-light"
                  placeholder="Cari berdasarkan nama kos, pemesan, atau nomor telepon..."
                  value={filters.search}
                  onChange={handleFilterChange}
                />
              </InputGroup>
            </Col>
          </Row>

          {paginatedBookings.length === 0 ? (
            <div className="text-center py-5">
              <div className="d-flex flex-column align-items-center">
                <div className="mb-4">
                  <img
                    src={notFoundImage}
                    alt="No Data Found"
                    style={{
                      width: "250px",
                      height: "auto",
                      objectFit: "contain",
                      opacity: 0.9,
                      borderRadius: "8px",
                    }}
                  />
                </div>
                <div>
                  <h5 className="text-muted mb-2">Belum Ada Booking</h5>
                  <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                    Belum ada pemesanan kos yang masuk saat ini
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <Table responsive hover>
                <thead>
                  <tr>
                    <th>No</th>
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
                  {paginatedBookings.map((booking, index) => (
                    <tr key={booking.id}>
                      <td>{indexOfFirstItem + index + 1}</td>
                      <td>{booking.kosName}</td>
                      <td>{booking.userName}</td>
                      <td>{booking.userPhone}</td>
                      <td>
                        {new Date(booking.startDate).toLocaleDateString(
                          "id-ID"
                        )}
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
                          className="px-3 py-2"
                        >
                          {booking.status}
                        </Badge>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          {booking.status === "pending" && (
                            <>
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() =>
                                  handleStatusUpdate(booking.id, "confirmed")
                                }
                                className="rounded-circle"
                                title="Konfirmasi"
                                style={{ width: "35px", height: "35px" }}
                              >
                                <FaCheck />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() =>
                                  handleStatusUpdate(booking.id, "rejected")
                                }
                                className="rounded-circle"
                                title="Tolak"
                                style={{ width: "35px", height: "35px" }}
                              >
                                <FaTimes />
                              </Button>
                            </>
                          )}
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(booking)}
                            className="rounded-circle"
                            title="Hapus"
                            style={{ width: "35px", height: "35px" }}
                          >
                            <FaTrash />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              <div className="d-flex justify-content-between align-items-center mt-4">
                <div className="text-muted small">
                  Menampilkan {paginatedBookings.length} dari{" "}
                  {filteredBookings.length} data
                </div>
                <div className="pagination-container d-flex align-items-center gap-3">
                  <Button
                    variant="light"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="d-flex align-items-center px-3 py-2 rounded-pill shadow-sm border"
                  >
                    Prev
                  </Button>

                  <div className="d-flex align-items-center gap-2">
                    {Array.from({ length: totalPages }, (_, index) => (
                      <Button
                        key={index + 1}
                        variant={
                          currentPage === index + 1 ? "primary" : "light"
                        }
                        size="sm"
                        onClick={() => setCurrentPage(index + 1)}
                        className="d-flex align-items-center px-3 py-2 rounded-pill shadow-sm border"
                      >
                        {index + 1}
                      </Button>
                    ))}
                  </div>

                  <Button
                    variant="light"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="d-flex align-items-center px-3 py-2 rounded-pill shadow-sm border"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default BookingList;
