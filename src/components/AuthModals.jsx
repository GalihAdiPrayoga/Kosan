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

const AuthModals = ({ showLogin, showRegister, handleClose, handleSwitch }) => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
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

      const response = await API.get("/db.json");
      const users = response.data.users;

      const user = users.find(
        (u) => u.email === loginData.email && u.password === loginData.password
      );

      if (!user) {
        throw new Error("Email atau password salah");
      }

      if (user.status !== "active") {
        throw new Error("Akun tidak aktif");
      }

      // Set user data in localStorage
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userName", user.name);
      localStorage.setItem("userType", user.role);
      localStorage.setItem("isAdmin", user.role === "admin" ? "true" : "false");

      handleClose();

      // Redirect based on role
      if (user.role === "admin") {
        window.location.href = "/admin/dashboard";
      } else {
        window.location.href = "/";
      }
    } catch (err) {
      setError(err.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!validateRegisterData()) {
        return;
      }

      setLoading(true);
      setError("");

      // Check if email already exists
      const response = await API.get("/db.json");
      const users = response.data.users;

      if (users.some((user) => user.email === registerData.email)) {
        throw new Error("Email already registered");
      }

      // Create new user object
      const newUser = {
        id: Date.now().toString(),
        ...registerData,
        role: "user",
        status: "active",
        createdAt: new Date().toISOString(),
      };

      // In a real app, you would make a POST request here
      console.log("New user registration:", newUser);

      // Auto login after successful registration
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("userId", newUser.id);
      localStorage.setItem("userName", newUser.name);
      localStorage.setItem("userType", "user");

      handleClose();
      window.location.reload();
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const resetError = () => {
    setError("");
  };

  return (
    <>
      {/* Login Modal */}
      <Modal
        show={showLogin}
        onHide={handleClose}
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
                  type="email"
                  placeholder="Email Address"
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
        onHide={handleClose}
        onExited={resetError}
        centered
      >
        <Modal.Header closeButton className="border-0">
          <Modal.Title className="w-100 text-center">
            <FaUserPlus className="auth-icon" />
            <h4>Create Account</h4>
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

            <Button
              type="submit"
              className="auth-btn w-100 mb-3"
              disabled={loading}
            >
              {loading ? (
                <Spinner animation="border" size="sm" className="me-2" />
              ) : null}
              Create Account
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
