import React, { useState, useEffect } from "react";
import {
  Container,
  Table,
  Badge,
  Card,
  Button,
  Alert,
  Spinner,
  ButtonGroup,
} from "react-bootstrap";
import { FaCheck, FaTimes } from "react-icons/fa";
import { API } from "../../api/config";
import { getImageUrl } from "../../utils/imageUtils";

const PaymentsAdmin = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

          {payments.length === 0 ? (
            <Alert variant="info">
              Belum ada data pembayaran yang tersedia.
            </Alert>
          ) : (
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
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment, index) => (
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
                            console.log("Failed to load image:", e.target.src);
                            e.target.onerror = null; // Prevent infinite loop
                            e.target.src = "/images/placeholder.jpg"; // Gunakan placeholder image
                          }}
                          title="Klik untuk memperbesar"
                        />
                      )}
                    </td>
                    <td>
                      <Badge
                        bg={
                          payment.status === "diterima"
                            ? "success"
                            : payment.status === "ditolak"
                            ? "danger"
                            : "warning"
                        }
                        className="text-capitalize"
                      >
                        {payment.status === "diterima" && "Diterima"}
                        {payment.status === "ditolak" && "Ditolak"}
                        {payment.status === "pending" && "Menunggu"}
                      </Badge>
                    </td>
                    <td>
                      {payment.status === "pending" && (
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-success"
                            size="sm"
                            onClick={() =>
                              handleUpdatePaymentStatus(payment.id, "diterima")
                            }
                            disabled={loading}
                            title="Terima Pembayaran"
                          >
                            <FaCheck />
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() =>
                              handleUpdatePaymentStatus(payment.id, "ditolak")
                            }
                            disabled={loading}
                            title="Tolak Pembayaran"
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

export default PaymentsAdmin;
