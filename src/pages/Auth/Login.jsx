import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUserCircle } from "react-icons/fa";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Dummy user credentials
  const dummyCredentials = {
    user: {
      email: "user@gmail.com",
      password: "user123",
    },
    admin: {
      email: "admin@gmail.com",
      password: "admin123",
    },
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check credentials
    if (
      formData.email === dummyCredentials.admin.email &&
      formData.password === dummyCredentials.admin.password
    ) {
      // Admin login
      localStorage.setItem("userType", "admin");
      localStorage.setItem("isLoggedIn", "true");
      navigate("/admin/dashboard");
    } else if (
      formData.email === dummyCredentials.user.email &&
      formData.password === dummyCredentials.user.password
    ) {
      // User login
      localStorage.setItem("userType", "user");
      localStorage.setItem("isLoggedIn", "true");
      navigate("/");
    } else {
      // Invalid credentials
      alert("Email atau password salah!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <div className="text-center mb-8">
              <FaUserCircle className="mx-auto text-blue-600 text-5xl mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back!
              </h1>
              <p className="text-gray-600">Please sign in to your account</p>
            </div>

            <Card className="border-0 shadow-lg rounded-lg">
              <Card.Body className="p-8">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4 relative">
                    <div className="flex items-center bg-gray-50 border rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-500">
                      <FaEnvelope className="text-gray-400 mr-2" />
                      <Form.Control
                        type="email"
                        placeholder="Enter your email"
                        className="border-0 bg-transparent focus:ring-0 focus:outline-none py-3"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <div className="flex items-center bg-gray-50 border rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-500">
                      <FaLock className="text-gray-400 mr-2" />
                      <Form.Control
                        type="password"
                        placeholder="Enter your password"
                        className="border-0 bg-transparent focus:ring-0 focus:outline-none py-3"
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
                    className="w-100 py-3 mb-4 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-200 rounded-lg font-semibold"
                  >
                    Sign In
                  </Button>

                  <div className="text-center">
                    <p className="text-gray-600">
                      Don't have an account?{" "}
                      <Link
                        to="/register"
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        Sign Up
                      </Link>
                    </p>
                  </div>

                  {/* Demo Credentials */}
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="text-sm text-gray-600 font-medium mb-2">
                      Demo Credentials:
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">User:</span>{" "}
                        user@gmail.com / user123
                      </p>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold">Admin:</span>{" "}
                        admin@gmail.com / admin123
                      </p>
                    </div>
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
