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

const PaymentHistory = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token not found");
      }

      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      const response = await API.get("/pembayarans/user");

      if (response.data.status === "success") {
        setPayments(response.data.data);
      } else {
        throw new Error(response.data.message || "Failed to fetch payments");
      }
      setLoading(false);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal memuat riwayat pembayaran"
      );
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: "warning",
      diterima: "success",
      ditolak: "danger",
    };
    return <Badge bg={variants[status] || "secondary"}>{status}</Badge>;
  };

  if (loading)
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );

  if (error) return <Alert variant="danger">{error}</Alert>;

  return (
    <Container className="py-5">
      <Card>
        <Card.Body>
          <h4 className="mb-4">Riwayat Pembayaran</h4>

          <Table responsive striped hover>
            <thead>
              <tr>
                <th>No</th>
                <th>Kos</th>
                <th>Tanggal Bayar</th>
                <th>Durasi</th>
                <th>Bukti</th>
                <th>Total Pembayaran</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment, index) => (
                <tr key={payment.id}>
                  <td>{index + 1}</td>
                  <td>
                    <div>{payment.kosan?.nama_kosan}</div>
                    <small className="text-muted">
                      {payment.kosan?.alamat}
                    </small>
                  </td>
                  <td>
                    {new Date(payment.tanggal_bayar).toLocaleDateString(
                      "id-ID"
                    )}
                  </td>
                  <td>{payment.durasi_sewa} bulan</td>
                  <td>
                    {payment.bukti_pembayaran && (
                      <Image
                        src={`${process.env.REACT_APP_API_URL}/storage/${payment.bukti_pembayaran}`}
                        alt="Bukti Pembayaran"
                        style={{
                          width: "50px",
                          height: "50px",
                          objectFit: "cover",
                        }}
                        className="cursor-pointer"
                        onClick={() =>
                          window.open(
                            `${process.env.REACT_APP_API_URL}/storage/${payment.bukti_pembayaran}`,
                            "_blank"
                          )
                        }
                      />
                    )}
                  </td>
                  <td>
                    Rp{" "}
                    {new Intl.NumberFormat("id-ID").format(payment.total_harga)}
                  </td>
                  <td>{getStatusBadge(payment.status)}</td>
                </tr>
              ))}
              {payments.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    Belum ada riwayat pembayaran
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default PaymentHistory;
