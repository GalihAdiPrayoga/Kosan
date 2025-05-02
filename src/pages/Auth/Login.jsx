import React, { useState } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEnvelope, FaLock, FaUserCircle } from "react-icons/fa";
import { API } from "../../api/config";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await API.get("/db.json");
      const users = response.data.users;

      const user = users.find(
        (u) => u.email === formData.email && u.password === formData.password
      );

      if (!user) {
        setError("Email atau password salah!");
        return;
      }

      if (user.status !== "active") {
        setError("Akun tidak aktif");
        return;
      }

      // Set user data in localStorage
      localStorage.setItem("userType", user.role);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name);

      // Redirect based on role or return to previous page
      if (user.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate(from, { replace: true });
      }
    } catch (err) {
      setError("Terjadi kesalahan saat login");
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-vh-100 bg-light py-5">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <div className="text-center mb-4">
              <FaUserCircle
                className="text-primary"
                style={{ fontSize: "3rem" }}
              />
              <h2 className="mt-3">Selamat Datang Kembali!</h2>
              <p className="text-muted">Silakan masuk ke akun Anda</p>
            </div>

            {message && (
              <Alert variant="info" className="mb-4">
                {message}
              </Alert>
            )}

            <Card className="shadow-sm">
              <Card.Body className="p-4">
                {error && <Alert variant="danger">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Email</Form.Label>
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
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label>Password</Form.Label>
                    <div className="input-group">
                      <span className="input-group-text">
                        <FaLock />
                      </span>
                      <Form.Control
                        type="password"
                        placeholder="Masukkan password Anda"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                      />
                    </div>
                  </Form.Group>

                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mb-3"
                    disabled={loading}
                  >
                    {loading ? "Memproses..." : "Masuk"}
                  </Button>

                  <div className="text-center">
                    <p className="mb-0">
                      Belum punya akun?{" "}
                      <Link to="/register" className="text-decoration-none">
                        Daftar
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
  );
};

export default Login;
