import React, { useState, useEffect } from "react";
import {
  Table,
  Badge,
  Container,
  Card,
  Alert,
  Image,
  Spinner,
} from "react-bootstrap";
import { API } from "../../api/config";
import { getImageUrl } from "../../utils/imageUtils";
import Swal from "sweetalert2";

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const token = localStorage.getItem("token");

      if (!token || !userId) {
        throw new Error("Authentication data not found");
      }

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.get(`/pembayarans/user/${userId}`);

      if (response.data.status === "success") {
        setPayments(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch payments");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal memuat riwayat pembayaran"
      );
      console.error("Error fetching payments:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: "warning",
      diterima: "success",
      ditolak: "danger",
      dibatalkan: "secondary", // Tambahkan ini
    };

    const statusText = {
      pending: "Menunggu",
      diterima: "Diterima",
      ditolak: "Ditolak",
      dibatalkan: "Dibatalkan", // Tambahkan ini
    };

    return (
      <Badge bg={variants[status] || "secondary"}>
        {statusText[status] || status}
      </Badge>
    );
  };

  const handleCancel = async (id) => {
    const confirm = await Swal.fire({
      title: "Batalkan Pesanan?",
      text: "Pesanan yang dibatalkan tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, batalkan",
      cancelButtonText: "Batal",
    });
    if (confirm.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
        const res = await API.put(`/pembayarans/${id}/cancel`);
        if (res.data.status === "success") {
          Swal.fire("Berhasil!", "Pesanan berhasil dibatalkan.", "success");
          fetchPayments(); // refresh data
        } else {
          Swal.fire(
            "Gagal",
            res.data.message || "Gagal membatalkan pesanan",
            "error"
          );
        }
      } catch (err) {
        Swal.fire(
          "Gagal",
          err.response?.data?.message || "Gagal membatalkan pesanan",
          "error"
        );
      }
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
    <Container className="py-5">
      <Card>
        <Card.Body>
          <h4 className="mb-4">Riwayat Pembayaran</h4>

          {error ? (
            <Alert variant="danger">{error}</Alert>
          ) : (
            <Table responsive striped hover>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kos</th>
                  <th>Kode Pembayaran</th>
                  <th>Tanggal Bayar</th>
                  <th>Durasi</th>
                  <th>Bukti</th>
                  <th>Total Pembayaran</th>
                  <th>Status</th>
                  <th>Aksi</th> {/* Tambahkan kolom aksi */}
                </tr>
              </thead>
              <tbody>
                {payments.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="text-center py-4">
                      Belum ada riwayat pembayaran
                    </td>
                  </tr>
                ) : (
                  payments.map((payment, index) => (
                    <tr key={payment.id}>
                      <td>{index + 1}</td>
                      <td>
                        <div>{payment.kosan?.nama_kosan}</div>
                        <small className="text-muted">
                          {payment.kosan?.alamat}
                        </small>
                      </td>
                      <td>{payment.kode_pembayaran || "-"}</td>
                      <td>
                        {new Date(payment.tanggal_bayar).toLocaleDateString(
                          "id-ID"
                        )}
                      </td>
                      <td>{payment.durasi_sewa} bulan</td>
                      <td>
                        {payment.bukti_pembayaran && (
                          <Image
                            src={getImageUrl(payment.bukti_pembayaran)}
                            alt="Bukti Pembayaran"
                            style={{
                              width: "50px",
                              height: "50px",
                              objectFit: "cover",
                              cursor: "pointer",
                              borderRadius: "4px",
                            }}
                            onClick={() =>
                              window.open(
                                getImageUrl(payment.bukti_pembayaran),
                                "_blank"
                              )
                            }
                          />
                        )}
                      </td>
                      <td>
                        Rp{" "}
                        {new Intl.NumberFormat("id-ID").format(
                          payment.total_harga
                        )}
                      </td>
                      <td>{getStatusBadge(payment.status)}</td>
                      <td>
                        {payment.status === "pending" && (
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleCancel(payment.id)}
                          >
                            Batalkan
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PaymentHistory;
