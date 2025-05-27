import React, { useState } from "react";
import { Modal, Form, Button, Alert, Spinner } from "react-bootstrap";
import {
  FaEnvelope,
  FaLock,
  FaUser,
  FaUserPlus,
  FaUserCircle,
} from "react-icons/fa";
import { API } from "../api/config";
import { useNavigate } from "react-router-dom";

const AuthModals = ({
  showLogin,
  showRegister,
  handleClose,
  handleSwitch,
  onLoginSuccess, // Add this prop
}) => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user", // Default role
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const validateRegisterData = () => {
    if (registerData.password !== registerData.confirmPassword) {
      setError("Passwords do not match");
      return false;
    }
    if (registerData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError("");

      const response = await API.post("/login", {
        email: loginData.email,
        password: loginData.password,
      });

      const user = response.data.user;
      const token = response.data.token;

      // Save token and user data
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userType", user.role);
      localStorage.setItem("token", token);

      // Set token to Authorization header
      API.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      handleClose();
      if (onLoginSuccess) {
        onLoginSuccess();
      }

          // Redirect based on user role
       if (user.role === "pemilik") {
    navigate("/pemilik/dashboard");
    } else if (user.role === "admin") {
    navigate("/admin/dashboard");
    } else {
    navigate("/user/dashboard");
    }
    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid credentials, please try again.");
      } else {
        setError(err.response?.data?.message || err.message || "Login failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!validateRegisterData()) return;

      setLoading(true);
      setError("");

      const response = await API.post("/register", {
        name: registerData.name,
        email: registerData.email,
        password: registerData.password,
        password_confirmation: registerData.confirmPassword,
        role: registerData.role,
      });

      const user = response.data.user;
      const token = response.data.token;

      // Save user data and token
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userType", user.role);
      localStorage.setItem("token", token); // for auth requests

      handleClose();
      window.location.reload(); // Reload to update UI
    } catch (err) {
      // Handle error from backend
      if (err.response?.status === 422) {
        const errors = err.response.data.errors;
        const firstError = errors[Object.keys(errors)[0]][0];
        setError(firstError);
      } else {
        setError(err.response?.data?.message || err.message || "Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const resetError = () => {
    setError("");
  };

  const handleCloseAndReset = () => {
    // Reset data when modal is closed
    setLoginData({ email: "", password: "" });
    setRegisterData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "user",
    });
    handleClose();
  };

  return (
    <>
      {/* Login Modal */}
      <Modal
        show={showLogin}
        onHide={handleCloseAndReset}
        onExited={resetError}
        centered
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="w-100 text-center">
            <FaUserCircle className="auth-icon" />
            <h4>Welcome Back!</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleLoginSubmit}>
            <div className="auth-input-group">
              <div className="input-group">
                <span className="input-group-text">
                  <FaEnvelope />
                </span>
                <Form.Control
                  type="text"
                  placeholder="Email Address or username"
                  value={loginData.email}
                  onChange={(e) =>
                    setLoginData({ ...loginData, email: e.target.value })
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
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
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
                <Spinner animation="border" size="sm" className="me-2" />
              ) : null}
              Sign In
            </Button>
          </Form>
          <div className="text-center">
            <p className="mb-0">
              Don't have an account?{" "}
              <Button
                variant="link"
                className="p-0"
                onClick={() => handleSwitch("register")}
                disabled={loading}
              >
                Sign Up
              </Button>
            </p>
          </div>
        </Modal.Body>
      </Modal>

      {/* Register Modal */}
      <Modal
        show={showRegister}
        onHide={handleCloseAndReset}
        onExited={resetError}
        centered
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="w-100 text-center">
            <FaUserPlus className="auth-icon" />
            <h4>Create an Account</h4>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleRegisterSubmit}>
            <div className="auth-input-group">
              <div className="input-group">
                <span className="input-group-text">
                  <FaUser />
                </span>
                <Form.Control
                  type="text"
                  placeholder="Full Name"
                  value={registerData.name}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, name: e.target.value })
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
                  placeholder="Email Address"
                  value={registerData.email}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, email: e.target.value })
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
                  placeholder="Password (min. 6 characters)"
                  value={registerData.password}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
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
                  placeholder="Confirm Password"
                  value={registerData.confirmPassword}
                  onChange={(e) =>
                    setRegisterData({
                      ...registerData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Form.Group className="auth-input-group">
              <div className="input-group">
                <span className="input-group-text">
                  <FaUserCircle />
                </span>
                <Form.Select
                  name="role"
                  value={registerData.role}
                  onChange={(e) =>
                    setRegisterData({ ...registerData, role: e.target.value })
                  }
                >
                  <option value="user">Pencari Kos</option>
                  <option value="pemilik">Pemilik Kos</option>
                </Form.Select>
              </div>
            </Form.Group>

            <Button
              type="submit"
              className="auth-btn w-100 mb-3"
              disabled={loading}
            >
              {loading ? (
                <Spinner animation="border" size="sm" className="me-2" />
              ) : null}
              Sign Up
            </Button>
          </Form>
          <div className="text-center">
            <p className="mb-0">
              Already have an account?{" "}
              <Button
                variant="link"
                className="p-0"
                onClick={() => handleSwitch("login")}
                disabled={loading}
              >
                Sign In
              </Button>
            </p>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default AuthModals;
