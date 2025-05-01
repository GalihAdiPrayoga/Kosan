import React, { useState } from "react";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaUser, FaUserPlus } from "react-icons/fa";

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add registration logic here
    console.log("Register attempt:", formData);
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4 sm:px-6 lg:px-8">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5}>
            <div className="text-center mb-8">
              <FaUserPlus className="mx-auto text-blue-600 text-5xl mb-4" />
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Create Account
              </h1>
              <p className="text-gray-600">Join us today!</p>
            </div>

            <Card className="border-0 shadow-lg rounded-lg">
              <Card.Body className="p-8">
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <div className="flex items-center bg-gray-50 border rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-500">
                      <FaUser className="text-gray-400 mr-2" />
                      <Form.Control
                        type="text"
                        placeholder="Full Name"
                        className="border-0 bg-transparent focus:ring-0 focus:outline-none py-3"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <div className="flex items-center bg-gray-50 border rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-500">
                      <FaEnvelope className="text-gray-400 mr-2" />
                      <Form.Control
                        type="email"
                        placeholder="Email Address"
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
                        placeholder="Password"
                        className="border-0 bg-transparent focus:ring-0 focus:outline-none py-3"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        required
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-6">
                    <div className="flex items-center bg-gray-50 border rounded-lg px-3 focus-within:ring-2 focus-within:ring-blue-500">
                      <FaLock className="text-gray-400 mr-2" />
                      <Form.Control
                        type="password"
                        placeholder="Confirm Password"
                        className="border-0 bg-transparent focus:ring-0 focus:outline-none py-3"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
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
                    Create Account
                  </Button>

                  <div className="text-center">
                    <p className="text-gray-600">
                      Already have an account?{" "}
                      <Link
                        to="/login"
                        className="text-blue-600 hover:text-blue-700 font-semibold"
                      >
                        Sign In
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

export default Register;
