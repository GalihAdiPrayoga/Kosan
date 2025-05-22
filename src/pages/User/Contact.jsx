import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
} from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { API } from "../../api/config";
import AuthModals from "../../components/AuthModals";
import Swal from "sweetalert2"; // Tambahkan import ini di bagian atas

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    kosan_id: "",
    isi_pengaduan: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [kosanList, setKosanList] = useState([]);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line
  }, []);

  const checkAuth = () => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      setShowLogin(true);
    } else {
      fetchKosanList();
    }
  };

  const handleClose = () => {
    setShowLogin(false);
    setShowRegister(false);
  };

  const handleSwitch = (type) => {
    if (type === "login") {
      setShowRegister(false);
      setShowLogin(true);
    } else {
      setShowLogin(false);
      setShowRegister(true);
    }
  };

  const fetchKosanList = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");

      if (!token || !userId) {
        throw new Error("Silakan login terlebih dahulu");
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const response = await API.get("/kosans", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (response.data?.data) {
        setKosanList(response.data.data);
        setError("");
      } else {
        throw new Error("Data kos tidak ditemukan");
      }
    } catch (err) {
      if (err.name === "AbortError") {
        setError("Koneksi timeout. Silakan coba lagi.");
      } else if (err.response?.status === 401) {
        setError("Sesi anda telah berakhir. Silakan login kembali.");
        setShowLogin(true);
      } else if (err.response?.status === 404) {
        setError("Data kos tidak ditemukan.");
      } else if (err.response?.data?.message) {
        setError(`Gagal memuat daftar kos: ${err.response.data.message}`);
      } else {
        setError("Gagal memuat daftar kos. Silakan coba lagi nanti.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        setError("User ID tidak ditemukan. Silakan login ulang.");
        setShowLogin(true);
        setLoading(false);
        return;
      }

      if (!formData.kosan_id || !formData.isi_pengaduan) {
        setError("Semua field harus diisi.");
        setLoading(false);
        return;
      }

      await API.post("/pengaduans", {
        ...formData,
        user_id: userId,
        status: "menunggu",
      });

      // Tampilkan SweetAlert dan redirect ke dashboard user setelah submit sukses
      await Swal.fire({
        icon: "success",
        title: "Feedback berhasil dikirim!",
        text: "Terima kasih atas feedback Anda.",
        timer: 1500,
        showConfirmButton: false,
      });

      navigate("/user/dashboard");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Gagal mengirim pengaduan"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8}>
            <Card className="shadow-sm">
              <Card.Body>
                <h2 className="mb-4">Formulir Feedback</h2>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Pilih Kos</Form.Label>
                    <Form.Select
                      value={formData.kosan_id}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          kosan_id: e.target.value,
                        }))
                      }
                      required
                      disabled={loading || kosanList.length === 0}
                    >
                      <option value="">Pilih Kos</option>
                      {kosanList.map((kos) => (
                        <option key={kos.id} value={kos.id}>
                          {kos.nama_kosan}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Isi Feedback</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      value={formData.isi_pengaduan}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          isi_pengaduan: e.target.value,
                        }))
                      }
                      placeholder="Tulis pengaduan Anda di sini..."
                      required
                      disabled={loading}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    disabled={loading || kosanList.length === 0}
                    className="w-100"
                  >
                    {loading ? (
                      <>
                        <Spinner size="sm" className="me-2" />
                        Mengirim...
                      </>
                    ) : (
                      "Kirim Pengaduan"
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      <AuthModals
        showLogin={showLogin}
        showRegister={showRegister}
        handleClose={handleClose}
        handleSwitch={handleSwitch}
        onLoginSuccess={() => {
          handleClose();
          fetchKosanList();
        }}
      />
    </>
  );
};

export default Contact;
