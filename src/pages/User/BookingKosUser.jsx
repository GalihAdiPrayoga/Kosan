import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Button,
  Alert,
  Toast,
  ToastContainer,
  Spinner,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../../api/config";
import qrImage from "../../assets/qr.jpg";

const BookingKosUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [kosDetail, setKosDetail] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [bookingData, setBookingData] = useState({
    startDate: new Date().toISOString().split("T")[0],
    duration: 1, // Changed from "1" to 1
    paymentProof: null,
  });

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [lastKodePembayaran, setLastKodePembayaran] = useState(""); // Tambahkan state baru

  // Tambahkan state untuk preview gambar
  const [previewImage, setPreviewImage] = useState(null);

  // Fetch kos detail and user data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("Please login first");
          navigate("/login");
          return;
        }

        // Set authorization header for all requests
        API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

        const [kosResponse, userResponse] = await Promise.all([
          API.get(`/kosans/public/${id}`),
          API.get("/me"),
        ]);

        setKosDetail(kosResponse.data.data[0]);
        setUser(userResponse.data);
        setLoading(false);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Session expired. Please login again");
          navigate("/login");
        } else {
          setError(
            "Failed to load data: " +
              (err.response?.data?.message || err.message)
          );
        }
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "paymentProof") {
      const file = files[0];
      setBookingData((prev) => ({
        ...prev,
        paymentProof: file,
      }));
      // Preview gambar
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => setPreviewImage(reader.result);
        reader.readAsDataURL(file);
      } else {
        setPreviewImage(null);
      }
    } else {
      setBookingData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const calculateTotal = () => {
    if (!kosDetail) return 0;
    return kosDetail.harga_per_bulan * parseInt(bookingData.duration);
  };

  const generatePaymentCode = () => {
    // Hasil: 100 + 3 digit random, misal 100123
    return "100" + Math.floor(100 + Math.random() * 900);
  };

  // Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user?.user?.id) {
        throw new Error("User ID not found. Please login again");
      }

      const totalHarga = calculateTotal();
      const kodePembayaran = generatePaymentCode();
      setLastKodePembayaran(kodePembayaran); // Simpan kode pembayaran ke state

      // Show loading with new style
      Swal.fire({
        title: "Memproses Pemesanan",
        html: `
          <div class="d-flex flex-column align-items-center">
            <div class="spinner-border text-primary mb-3" role="status" style="width: 3rem; height: 3rem;">
              <span class="visually-hidden">Loading...</span>
            </div>
            <p class="text-muted mb-0">Mohon tunggu sebentar...</p>
          </div>
        `,
        showConfirmButton: false,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formData = new FormData();
      formData.append("user_id", user.user.id);
      formData.append("kosan_id", kosDetail.id);
      formData.append("tanggal_bayar", bookingData.startDate);
      formData.append("durasi_sewa", bookingData.duration);
      formData.append("total_harga", totalHarga);
      formData.append("bukti_pembayaran", bookingData.paymentProof);
      formData.append("status", "pending");
      formData.append("kode_pembayaran", kodePembayaran);

      const token = localStorage.getItem("token");
      await API.post("/pembayarans", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      // Tampilkan kode booking di alert sukses
      await Swal.fire({
        icon: "success",
        title: "Pemesanan Berhasil!",
        html: `<div>
          Pesanan Anda sedang diproses.<br/>
          <strong>Kode Booking Anda:</strong><br/>
          <span style="font-size:1.5rem;color:#007bff">${kodePembayaran}</span>
          <br/><br/>Simpan kode ini untuk pengecekan status pembayaran.
        </div>`,
        showConfirmButton: true, // User harus klik OK
        confirmButtonText: "OK",
        backdrop: `
          rgba(0,123,255,0.4)
          left top
          no-repeat
        `,
        customClass: {
          popup: "animated fadeInDown",
        },
      });

      navigate("/user/dashboard", { replace: true });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Pemesanan Gagal",
        text:
          err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan saat memproses pemesanan",
        confirmButtonColor: "#dc3545",
      });
    }
  };

  // Tambahkan fungsi hapus preview
  const handleRemovePreview = () => {
    setPreviewImage(null);
    setBookingData((prev) => ({
      ...prev,
      paymentProof: null,
    }));
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div
          className="d-flex flex-column align-items-center justify-content-center"
          style={{ minHeight: "60vh" }}
        >
          <Spinner
            animation="border"
            variant="primary"
            style={{ width: "3rem", height: "3rem" }}
            className="mb-3"
          />
          <h5 className="text-muted mb-2">Memuat Data</h5>
          <p className="text-muted" style={{ fontSize: "0.9rem" }}>
            Mohon tunggu sebentar...
          </p>
        </div>
      </Container>
    );
  }
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!kosDetail) return <Alert variant="warning">Kos tidak ditemukan</Alert>;

  return (
    <Container className="py-5">
      <Row>
        <Col md={8}>
          <Card className="mb-4">
            <Card.Body>
              <h4 className="mb-4">Form Pemesanan</h4>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Tanggal Booking</Form.Label>
                      <Form.Control
                        type="date"
                        name="startDate"
                        value={bookingData.startDate}
                        onChange={handleInputChange}
                        required
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Durasi Sewa (Bulan)</Form.Label>
                      <Form.Control
                        type="number"
                        name="duration"
                        value={bookingData.duration}
                        onChange={handleInputChange}
                        min="1"
                        max="24"
                        required
                      />
                      <Form.Text className="text-muted">
                        Masukkan jumlah bulan (1-24 bulan)
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  {/* QR Code dan info rekening ... */}
                  <div className="text-center mb-3">
                    <img
                      src={qrImage}
                      alt="QR Code Pembayaran"
                      style={{
                        width: "220px",
                        height: "220px",
                        objectFit: "contain",
                        display: "block",
                        margin: "0 auto",
                      }}
                    />
                    <div
                      className="text-muted mt-2"
                      style={{ fontSize: "1rem" }}
                    >
                      Scan QR untuk transfer pembayaran
                    </div>
                    <div
                      className="mt-2"
                      style={{ fontSize: "1rem", color: "#333" }}
                    >
                      <strong>No. Rekening:</strong> 1234567890
                      
                    </div>
                  </div>
                  <Form.Label>Bukti Pembayaran</Form.Label>
                  <Form.Control
                    type="file"
                    name="paymentProof"
                    onChange={handleInputChange}
                    accept="image/*"
                    required
                  />
                  {/* Preview gambar di bawah input file, bisa klik & hapus */}
                  {previewImage && (
                    <div className="text-center mt-3 position-relative d-inline-block">
                      <img
                        src={previewImage}
                        alt="Preview Bukti Pembayaran"
                        style={{
                          maxWidth: "200px",
                          maxHeight: "200px",
                          objectFit: "contain",
                          borderRadius: "8px",
                          border: "1px solid #eee",
                          cursor: "pointer",
                        }}
                        title="Klik untuk memperbesar"
                        onClick={() => window.open(previewImage, "_blank")}
                      />
                      {/* Tombol hapus di pojok kanan atas */}
                      <Button
                        variant="danger"
                        size="sm"
                        className="position-absolute top-0 end-0 m-1 rounded-circle p-0"
                        style={{
                          width: "24px",
                          height: "24px",
                          lineHeight: "20px",
                        }}
                        onClick={handleRemovePreview}
                        title="Hapus gambar"
                      >
                        ×
                      </Button>
                      <div className="text-muted small mt-1">
                        Preview Bukti Pembayaran
                      </div>
                    </div>
                  )}
                  <Form.Text className="text-muted">
                    Upload bukti transfer pembayaran (Max: 2MB)
                  </Form.Text>
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100">
                  Kirim Pesanan
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="sticky-top" style={{ top: "20px" }}>
            <Card.Body>
              <h5>Detail Pemesanan</h5>
              <hr />
              <p>
                <strong>{kosDetail.nama_kosan}</strong>
                <br />
                {kosDetail.alamat}
                <br />
                Kategori: {kosDetail.kategori?.nama_kategori}
              </p>
              <hr />
              <div className="d-flex justify-content-between mb-2">
                <span>Harga per bulan:</span>
                <span>
                  Rp{" "}
                  {new Intl.NumberFormat("id-ID").format(
                    kosDetail.harga_per_bulan
                  )}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Durasi:</span>
                <span>{bookingData.duration} Bulan</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between">
                <strong>Total:</strong>
                <strong>
                  Rp {new Intl.NumberFormat("id-ID").format(calculateTotal())}
                </strong>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg="success"
        >
          <Toast.Header closeButton={false}>
            <strong className="me-auto">Notifikasi</strong>
          </Toast.Header>
          <Toast.Body className="text-white">{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </Container>
  );
};

export default BookingKosUser;
