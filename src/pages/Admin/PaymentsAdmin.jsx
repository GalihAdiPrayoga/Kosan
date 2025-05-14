import React, { useState, useEffect, useMemo } from "react";
import {
  Container,
  Table,
  Badge,
  Card,
  Button,
  Alert,
  Spinner,
  ButtonGroup,
  Form,
  InputGroup,
  Row,
  Col,
  Pagination,
} from "react-bootstrap";
import { FaCheck, FaTimes, FaSearch, FaFolder } from "react-icons/fa";
import { API } from "../../api/config";
import { getImageUrl } from "../../utils/imageUtils";

const ITEMS_PER_PAGE = 10;

const PaymentsAdmin = () => {
  // Update state
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
  });

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const response = await API.get("/pembayarans");
      const paymentData = response.data;
      setPayments(paymentData);
      setError(null);
    } catch (err) {
      setError("Failed to fetch payment data");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePaymentStatus = async (paymentId, status) => {
    try {
      setLoading(true);
      await API.patch(`/pembayarans/${paymentId}`, {
        status: status,
      });
      await fetchPayments(); // Refresh the payments list
      setError(null);
    } catch (err) {
      setError(
        `Gagal ${status === "diterima" ? "menerima" : "menolak"} pembayaran`
      );
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Add filtered and paginated data with useMemo
  const filteredPayments = useMemo(() => {
    return payments.filter((payment) => {
      const searchMatch = filters.search.toLowerCase();
      const statusMatch =
        filters.status === "all" || payment.status === filters.status;

      const searchableFields = [
        payment.id,
        payment.user?.name,
        payment.kosan?.nama_kosan,
        new Intl.NumberFormat("id-ID").format(payment.total_harga),
        new Date(payment.tanggal_bayar).toLocaleDateString("id-ID"),
      ]
        .map((field) => field?.toString().toLowerCase())
        .filter(Boolean);

      return (
        statusMatch &&
        (filters.search === "" ||
          searchableFields.some((field) => field?.includes(searchMatch)))
      );
    });
  }, [payments, filters]);

  const paginatedPayments = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return [...filteredPayments].slice(start, start + ITEMS_PER_PAGE);
  }, [filteredPayments, currentPage]);

  // Add handler for filter changes
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setCurrentPage(1);
  };

  // Add reset filters function
  const handleReset = () => {
    setFilters({
      search: "",
      status: "all",
    });
    setCurrentPage(1);
  };

  const getBadgeStyles = (status) => {
    const styles = {
      diterima: {
        backgroundColor: "rgba(16, 185, 129, 0.1)",
        color: "#10B981",
        border: "1px solid #10B981",
        fontWeight: "500",
        padding: "8px 16px",
        fontSize: "0.85rem",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        borderRadius: "50px", // Add this line
        transition: "all 0.2s ease", // Add smooth transition
      },
      ditolak: {
        backgroundColor: "rgba(239, 68, 68, 0.1)",
        color: "#EF4444",
        border: "1px solid #EF4444",
        fontWeight: "500",
        padding: "8px 16px",
        fontSize: "0.85rem",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        borderRadius: "50px", // Add this line
        transition: "all 0.2s ease", // Add smooth transition
      },
      pending: {
        backgroundColor: "rgba(245, 158, 11, 0.1)",
        color: "#F59E0B",
        border: "1px solid #F59E0B",
        fontWeight: "500",
        padding: "8px 16px",
        fontSize: "0.85rem",
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        borderRadius: "50px", // Add this line
        transition: "all 0.2s ease", // Add smooth transition
      },
    };

    const baseStyle = styles[status] || styles.pending;
    return {
      ...baseStyle,
      "&:hover": {
        transform: "translateY(-1px)",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      },
    };
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Manajemen Pembayaran</h2>
          </div>

          {error && (
            <Alert variant="danger" className="mb-4">
              {error}
            </Alert>
          )}

          <Row className="mb-4">
            <Col md={4}>
              <Form.Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className="mb-3 mb-md-0"
              >
                <option value="all">Semua Status</option>
                <option value="pending">Menunggu</option>
                <option value="diterima">Diterima</option>
                <option value="ditolak">Ditolak</option>
              </Form.Select>
            </Col>
            <Col md={8}>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0">
                  <FaSearch className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  name="search"
                  className="border-start-0 bg-light"
                  placeholder="Cari berdasarkan ID, nama penyewa, atau nama kos..."
                  value={filters.search}
                  onChange={handleFilterChange}
                  autoComplete="off"
                />
              </InputGroup>
            </Col>
          </Row>

          <div className="mb-3">
            <small className="text-muted">
              Menampilkan {filteredPayments.length} dari {payments.length}{" "}
              transaksi
              {filteredPayments.length > 0 &&
                ` (Halaman ${currentPage} dari ${Math.ceil(
                  filteredPayments.length / ITEMS_PER_PAGE
                )})`}
            </small>
          </div>

          {/* Update the table to use paginatedPayments */}
          {paginatedPayments.length === 0 ? (
            <div className="text-center py-5">
              <div className="d-flex flex-column align-items-center">
                <div className="mb-3">
                  <FaFolder
                    size={64}
                    className="text-muted"
                    style={{ opacity: 0.5 }}
                  />
                </div>
                <div>
                  <h5 className="text-muted mb-1">Data Tidak Ditemukan</h5>
                  <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                    {payments.length === 0
                      ? "Belum ada data pembayaran yang tersedia"
                      : "Tidak ada data pembayaran yang sesuai dengan pencarian"}
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
                    <th>ID Pembayaran</th>
                    <th>Nama Penyewa</th>
                    <th>Nama Kos</th>
                    <th>Total Harga</th>
                    <th>Tanggal Bayar</th>
                    <th>Bukti Pembayaran</th>
                    <th>Status</th>
                    {/* Only show action column header if there are pending payments */}
                    {paginatedPayments.some(
                      (payment) => payment.status === "pending"
                    ) && <th>Aksi</th>}
                  </tr>
                </thead>
                <tbody>
                  {paginatedPayments.map((payment, index) => (
                    <tr key={payment.id}>
                      <td>{index + 1}</td>
                      <td>{payment.id}</td>
                      <td>{payment.user?.name}</td>
                      <td>{payment.kosan?.nama_kosan}</td>
                      <td>
                        Rp{" "}
                        {new Intl.NumberFormat("id-ID").format(
                          payment.total_harga
                        )}
                      </td>
                      <td>
                        {new Date(payment.tanggal_bayar).toLocaleDateString(
                          "id-ID"
                        )}
                      </td>
                      <td>
                        {payment.bukti_pembayaran && (
                          <img
                            src={getImageUrl(payment.bukti_pembayaran)}
                            alt="Bukti Pembayaran"
                            style={{
                              width: "100px",
                              height: "100px",
                              objectFit: "cover",
                              cursor: "pointer",
                              borderRadius: "8px", // Tambahan untuk tampilan lebih baik
                            }}
                            onClick={() =>
                              window.open(
                                getImageUrl(payment.bukti_pembayaran),
                                "_blank"
                              )
                            }
                            onError={(e) => {
                              console.log(
                                "Failed to load image:",
                                e.target.src
                              );
                              e.target.onerror = null; // Prevent infinite loop
                              e.target.src = "/images/placeholder.jpg"; // Gunakan placeholder image
                            }}
                            title="Klik untuk memperbesar"
                          />
                        )}
                      </td>
                      <td>
                        <div style={getBadgeStyles(payment.status)}>
                          {payment.status === "diterima" && (
                            <>
                              <FaCheck size={14} />
                              Diterima
                            </>
                          )}
                          {payment.status === "ditolak" && (
                            <>
                              <FaTimes size={14} />
                              Ditolak
                            </>
                          )}
                          {payment.status === "pending" && (
                            <>
                              <span className="spinner-grow spinner-grow-sm" />
                              Menunggu
                            </>
                          )}
                        </div>
                      </td>
                      {/* Only render action column if payment is pending */}
                      {payment.status === "pending" && (
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-success"
                              size="sm"
                              onClick={() =>
                                handleUpdatePaymentStatus(
                                  payment.id,
                                  "diterima"
                                )
                              }
                              disabled={loading}
                              className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: "35px", height: "35px" }}
                              title="Terima Pembayaran"
                            >
                              <FaCheck size={14} />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() =>
                                handleUpdatePaymentStatus(payment.id, "ditolak")
                              }
                              disabled={loading}
                              className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: "35px", height: "35px" }}
                              title="Tolak Pembayaran"
                            >
                              <FaTimes size={14} />
                            </Button>
                          </div>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </Table>

              {filteredPayments.length > ITEMS_PER_PAGE && (
                <div className="d-flex justify-content-center mt-4 gap-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "35px", height: "35px" }}
                  >
                    &lt;
                  </Button>

                  {(() => {
                    const totalPages = Math.ceil(
                      filteredPayments.length / ITEMS_PER_PAGE
                    );
                    let startPage = Math.max(1, currentPage - 2);
                    let endPage = Math.min(totalPages, startPage + 4);

                    if (endPage - startPage < 4) {
                      startPage = Math.max(1, endPage - 4);
                    }

                    return Array.from(
                      { length: endPage - startPage + 1 },
                      (_, idx) => {
                        const pageNumber = startPage + idx;
                        return (
                          <Button
                            key={pageNumber}
                            variant={
                              currentPage === pageNumber
                                ? "primary"
                                : "outline-primary"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(pageNumber)}
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{ width: "35px", height: "35px" }}
                          >
                            {pageNumber}
                          </Button>
                        );
                      }
                    );
                  })()}

                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(
                          prev + 1,
                          Math.ceil(filteredPayments.length / ITEMS_PER_PAGE)
                        )
                      )
                    }
                    disabled={
                      currentPage ===
                      Math.ceil(filteredPayments.length / ITEMS_PER_PAGE)
                    }
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: "35px", height: "35px" }}
                  >
                    &gt;
                  </Button>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PaymentsAdmin;
