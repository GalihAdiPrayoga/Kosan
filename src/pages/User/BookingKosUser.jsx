import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Form,
  Card,
  Button,
  Alert,
} from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";
import { API } from "../../api/config";

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
      setBookingData((prev) => ({
        ...prev,
        paymentProof: files[0],
      }));
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

  // Update the handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!user?.user?.id) {
        throw new Error("User ID not found. Please login again");
      }

      const totalHarga = calculateTotal();

      const formData = new FormData();
      formData.append("user_id", user.user.id);
      formData.append("kosan_id", kosDetail.id);
      formData.append("tanggal_bayar", bookingData.startDate);
      formData.append("durasi_sewa", bookingData.duration);
      formData.append("total_harga", totalHarga);
      formData.append("bukti_pembayaran", bookingData.paymentProof);
      formData.append("status", "pending");

      const token = localStorage.getItem("token");
      await API.post("/pembayarans", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      navigate("/payments/history");
    } catch (err) {
      setError(
        "Gagal melakukan pemesanan: " +
          (err.response?.data?.message || err.message)
      );
    }
  };

  if (loading) return <div>Loading...</div>;
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
                      <Form.Label>Tanggal Bayar</Form.Label>
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
                  <Form.Label>Bukti Pembayaran</Form.Label>
                  <Form.Control
                    type="file"
                    name="paymentProof"
                    onChange={handleInputChange}
                    accept="image/*"
                    required
                  />
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
    </Container>
  );
};

export default BookingKosUser;
