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
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEnvelope, FaLock, FaUserCircle } from "react-icons/fa";
import { CSSTransition } from "react-transition-group";
import { loginUser } from "../../api/auth";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const message = location.state?.message;

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Tambahkan fungsi clearSession
  const clearSession = () => {
    localStorage.clear();
    console.log("Session cleared");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    clearSession();

    try {
      const user = await loginUser(formData.email, formData.password);

      // Set user data in localStorage with role-specific flags
      localStorage.setItem("userType", user.role);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("isAdmin", user.role === "admin" ? "true" : "false");
      localStorage.setItem(
        "isPemilik",
        user.role === "pemilik" ? "true" : "false"
      );

      // Redirect based on role with success message
      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard", {
            state: { message: "Selamat datang, Admin!" },
          });
          break;
        case "pemilik":
          navigate("/pemilik/dashboard", {
            state: { message: "Selamat datang, Pemilik Kos!" },
          });
          break;
        default:
          navigate("/", {
            state: { message: "Login berhasil!" },
          });
      }
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat login");
      console.error("Login error:", err);
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
                <FaUserCircle className="auth-icon mb-3" size={60} />
                <h2 className="text-white mb-2">Selamat Datang Kembali!</h2>
                <p className="text-white-50">Silakan masuk ke akun Anda</p>
              </div>

              {message && (
                <Alert variant="info" className="mb-4">
                  {message}
                </Alert>
              )}

              <Card className="auth-card">
                <Card.Body className="p-4">
                  {error && <Alert variant="danger">{error}</Alert>}

                  <Form onSubmit={handleSubmit}>
                    <div className="auth-input-group">
                      <div className="input-group">
                        <span className="input-group-text">
                          <FaEnvelope />
                        </span>
                        <Form.Control
                          type="email"
                          placeholder="Masukkan email Anda"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                          disabled={loading}
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
                          placeholder="Masukkan password Anda"
                          value={formData.password}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              password: e.target.value,
                            })
                          }
                          required
                          disabled={loading}
                        />
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
                          Sedang Masuk...
                        </>
                      ) : (
                        "Masuk"
                      )}
                    </Button>

                    <div className="text-center">
                      <p className="mb-0">
                        Belum punya akun?{" "}
                        <Link to="/register" className="text-primary fw-bold">
                          Daftar Sekarang
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

export default Login;
