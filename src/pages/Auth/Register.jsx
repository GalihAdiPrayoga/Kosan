import React, { useState } from "react";
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
import { Link, useNavigate } from "react-router-dom";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaUserPlus,
  FaPhone,
} from "react-icons/fa";
import { CSSTransition } from "react-transition-group";
import { API } from "../../api/config";
import axios from "axios";
import Swal from "sweetalert2";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default role
    nomor: "", // Add this line
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Client-side validation
      if (!formData.name || !formData.email || !formData.password) {
        throw new Error("Semua field harus diisi");
      }

      if (formData.password !== formData.confirmPassword) {
        throw new Error("Password tidak cocok");
      }

      if (formData.password.length < 6) {
        throw new Error("Password minimal 6 karakter");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        throw new Error("Format email tidak valid");
      }

      // Add phone number validation
      if (!formData.nomor.startsWith("62")) {
        throw new Error("Nomor telepon harus diawali dengan 62");
      }

      const response = await API.post("/register", {
        name: formData.name.trim(),
        email: formData.email.toLowerCase().trim(),
        password: formData.password,
        role: formData.role,
        nomor: formData.nomor.trim(),
      });

      const { user, token } = response.data;

      // Save data to localStorage
      localStorage.setItem("token", token);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userType", formData.role);
      localStorage.setItem("isLoggedIn", "true");

      // Set token for subsequent requests
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Show success message and navigate based on role
      await Swal.fire({
        icon: "success",
        title: "Registrasi Berhasil!",
        text: `Selamat datang, ${user.name}!`,
        timer: 1500,
        showConfirmButton: false,
        willClose: () => {
          // Navigate after alert closes
          if (formData.role === "pemilik") {
            navigate("/pemilik/dashboard");
          } else {
            navigate("/user/dashboard");
          }
        },
      });
    } catch (err) {
      console.error("Registration error:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Registrasi gagal. Silakan coba lagi."
      );
      await Swal.fire({
        icon: "error",
        title: "Registrasi Gagal!",
        text: err.response?.data?.message || "Terjadi kesalahan saat mendaftar",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <CSSTransition in={true} appear={true} timeout={300} classNames="auth-page">
      <div className="auth-container">
        <Container>
          <Row className="justify-content-center">
            <Col md={6} lg={5}>
              <div className="text-center mb-4">
                <FaUserPlus className="auth-icon mb-3" size={60} />
                <h2 className="text-white mb-2">Buat Akun Baru</h2>
                <p className="text-white-50">Bergabunglah dengan kami!</p>
              </div>

              <Card className="auth-card">
                <Card.Body className="p-4">
                  {error && <Alert variant="danger">{error}</Alert>}

                  <Form onSubmit={handleSubmit}>
                    <div className="auth-input-group">
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaUser />
                        </span>
                        <Form.Control
                          type="text"
                          placeholder="Nama Lengkap"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="auth-input-group">
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaEnvelope />
                        </span>
                        <Form.Control
                          type="email"
                          placeholder="Alamat Email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    {/* Add this after the email input group */}
                    <div className="auth-input-group">
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaPhone />
                        </span>
                        <Form.Control
                          type="tel"
                          placeholder="Nomor Telepon (diawali 62)"
                          value={formData.nomor}
                          onChange={(e) => {
                            let value = e.target.value.replace(/[^0-9]/g, "");
                            if (!value.startsWith("62") && value.length > 0) {
                              value = "62" + value;
                            }
                            setFormData({ ...formData, nomor: value });
                          }}
                          required
                          disabled={loading}
                          pattern="62[0-9]*"
                          maxLength="15"
                        />
                      </div>
                    </div>

                    <div className="auth-input-group">
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaLock />
                        </span>
                        <Form.Control
                          type="password"
                          placeholder="Password (min. 6 karakter)"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          required
                          disabled={loading}
                          minLength={6}
                        />
                      </div>
                    </div>

                    <div className="auth-input-group">
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaLock />
                        </span>
                        <Form.Control
                          type="password"
                          placeholder="Konfirmasi Password"
                          value={formData.confirmPassword}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              confirmPassword: e.target.value,
                            })
                          }
                          required
                          disabled={loading}
                        />
                      </div>
                    </div>

                    <div className="auth-input-group">
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaUser />
                        </span>
                        <Form.Select
                          value={formData.role}
                          onChange={(e) =>
                            setFormData({ ...formData, role: e.target.value })
                          }
                          disabled={loading}
                        >
                          <option value="user">User</option>
                          <option value="pemilik">Pemilik Kos</option>
                        </Form.Select>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="auth-btn w-100 mb-3"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Sedang Mendaftar...
                        </>
                      ) : (
                        "Daftar"
                      )}
                    </Button>

                    <div className="text-center">
                      <p className="mb-0">
                        Sudah punya akun?{" "}
                        <Link to="/login" className="text-primary fw-bold">
                          Masuk
                        </Link>
                      </p>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </CSSTransition>
  );
};

export default Register;
