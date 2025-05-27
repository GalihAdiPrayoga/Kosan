import React, { useState } from "react";
import {
  Container, Row, Col, Card, Form, Button, Alert, Spinner
} from "react-bootstrap";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaEnvelope, FaLock, FaUserCircle } from "react-icons/fa";
import { CSSTransition } from "react-transition-group";
import axios from "axios";

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";
  const message = location.state?.message;

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/login`, formData);

      if (res.data.token && res.data.user) {
        const { token, user } = res.data;

        localStorage.setItem("token", token);
        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userId", user.id);
        localStorage.setItem("userName", user.name);
        localStorage.setItem("userType", user.role);
        localStorage.setItem("isAdmin", user.role === "admin" ? "true" : "false");
        localStorage.setItem("isPemilik", user.role === "pemilik" ? "true" : "false");


        if (user.role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else if (user.role === "pemilik") {
          navigate("/pemilik/dashboard", { replace: true });
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(error.response?.data?.message || "Login gagal. Silakan coba lagi.");
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

              {message && <Alert variant="info">{message}</Alert>}

              <Card className="auth-card">
                <Card.Body>
                  {error && <Alert variant="danger">{error}</Alert>}

                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <div className="input-group">
                        <span className="input-group-text"><FaEnvelope /></span>
                        <Form.Control
                          type="text"
                          placeholder="Email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value.trim() })}
                          required
                          disabled={loading}
                        />
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <div className="input-group">
                        <span className="input-group-text"><FaLock /></span>
                        <Form.Control
                          type="password"
                          placeholder="Password"
                          value={formData.password}
                          onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                          required
                          disabled={loading}
                        />
                      </div>
                    </Form.Group>

                    <Button type="submit" className="w-100" disabled={loading}>
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" role="status" className="me-2" />
                          Sedang Masuk...
                        </>
                      ) : "Masuk"}
                    </Button>
                  </Form>

                  <div className="text-center mt-3">
                    <p>Belum punya akun? <Link to="/register">Daftar Sekarang</Link></p>
                  </div>
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
