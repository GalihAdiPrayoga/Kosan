import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Alert, Spinner } from "react-bootstrap";
import { API } from "../api/config";
import { FaUser, FaEnvelope, FaPhone } from "react-icons/fa";

const EditProfileModal = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nomor: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (show) {
      fetchUserData();
    }
  }, [show]);

  const fetchUserData = async () => {
    try {
      const response = await API.get("/me");

      // Data user ada di dalam response.data.user
      const userData = response.data.user;

      setFormData({
        name: userData.name || "",
        email: userData.email || "",
        nomor: userData.nomor || "",
      });
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Gagal memuat data profil");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Update profile using the /me endpoint
      const response = await API.put("/me/update", formData);

      if (response.data.status === "success") {
        // Update localStorage with new user data
        localStorage.setItem("userName", formData.name);

        setSuccess("Profil berhasil diperbarui");
        setTimeout(() => {
          handleClose();
          // Reload component instead of full page
          window.dispatchEvent(new Event("userUpdated"));
        }, 1500);
      } else {
        setError("Gagal memperbarui profil");
      }
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "Gagal memperbarui profil");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Profil</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {success && <Alert variant="success">{success}</Alert>}

        <Form onSubmit={handleSubmit}>
          <div className="mb-3">
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
              />
            </div>
          </div>

          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text">
                <FaEnvelope />
              </span>
              <Form.Control
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <div className="input-group">
              <span className="input-group-text">
                <FaPhone />
              </span>
              <Form.Control
                type="tel"
                placeholder="Nomor Telepon (62xxx)"
                value={formData.nomor}
                onChange={(e) => {
                  let value = e.target.value.replace(/[^0-9]/g, "");
                  if (!value.startsWith("62") && value.length > 0) {
                    value = "62" + value;
                  }
                  setFormData({ ...formData, nomor: value });
                }}
                required
                pattern="62[0-9]*"
                maxLength="15"
              />
            </div>
          </div>

          <div className="d-grid">
            <Button type="submit" disabled={loading} className="rounded-pill">
              {loading ? (
                <>
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    className="me-2"
                  />
                  Menyimpan...
                </>
              ) : (
                "Simpan Perubahan"
              )}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProfileModal;
