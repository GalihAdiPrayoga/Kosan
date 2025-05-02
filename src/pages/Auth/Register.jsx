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
import { FaEnvelope, FaLock, FaUser, FaUserPlus } from "react-icons/fa";
import { CSSTransition } from "react-transition-group";
import { API } from "../../api/config";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (formData.password !== formData.confirmPassword) {
        throw new Error("Password tidak cocok");
      }

      if (formData.password.length < 6) {
        throw new Error("Password minimal 6 karakter");
      }

      const response = await API.get("/db.json");
      const users = response.data.users;

      if (users.some((user) => user.email === formData.email)) {
        throw new Error("Email sudah terdaftar");
      }

      const newUser = {
        id: Date.now().toString(),
        ...formData,
        role: "user",
        status: "active",
        createdAt: new Date().toISOString(),
      };

      console.log("Register attempt:", newUser);
      navigate("/login", {
        state: { message: "Registrasi berhasil! Silakan login." },
      });
    } catch (err) {
      setError(err.message || "Gagal mendaftar");
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
