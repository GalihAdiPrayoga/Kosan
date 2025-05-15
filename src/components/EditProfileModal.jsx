import React, { useState, useEffect } from "react";
import { Modal, Form, Button, Spinner } from "react-bootstrap";
import { API } from "../api/config";
import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaEye,
  FaEyeSlash,
  FaKey,
  FaTrash,
} from "react-icons/fa";
import Swal from "sweetalert2";

const EditProfileModal = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nomor: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

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
      const response = await API.put("/me/update", formData);

      if (response.data.status === "success") {
        localStorage.setItem("userName", formData.name);

        setSuccess("Profil berhasil diperbarui");
        Swal.fire({
          icon: "success",
          title: "Berhasil!",
          text: "Profil berhasil diperbarui.",
          timer: 1500,
          showConfirmButton: false,
          background: "#fff",
        });
        setTimeout(() => {
          handleClose();
          window.dispatchEvent(new Event("userUpdated"));
        }, 1500);
      } else {
        setError("Gagal memperbarui profil");
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: "Gagal memperbarui profil.",
          background: "#fff",
        });
      }
    } catch (err) {
      console.error("Update error:", err);
      setError(err.response?.data?.message || "Gagal memperbarui profil");
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: err.response?.data?.message || "Gagal memperbarui profil.",
        background: "#fff",
      });
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPasswordLoading(true);
    try {
      const res = await API.put("/me/change-password", passwordData);
      if (res.data.status === "success") {
        Swal.fire({
          icon: "success",
          title: "Password berhasil diubah",
          timer: 1500,
          showConfirmButton: false,
          background: "#fff",
        });
        setShowPassword(false);
        setPasswordData({ oldPassword: "", newPassword: "" });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: res.data.message || "Gagal mengubah password.",
          background: "#fff",
        });
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: err.response?.data?.message || "Gagal mengubah password.",
        background: "#fff",
      });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirm = await Swal.fire({
      title: "Yakin ingin menghapus akun?",
      text: "Akun yang dihapus tidak dapat dikembalikan.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
      background: "#fff",
    });
    if (confirm.isConfirmed) {
      try {
        const res = await API.delete("/me/delete");
        if (res.data.status === "success") {
          Swal.fire({
            icon: "success",
            title: "Akun berhasil dihapus",
            timer: 1500,
            showConfirmButton: false,
            background: "#fff",
          });
          // Logout user, redirect, atau clear localStorage sesuai kebutuhan
          localStorage.clear();
          window.location.href = "/";
        } else {
          Swal.fire({
            icon: "error",
            title: "Gagal",
            text: res.data.message || "Gagal menghapus akun.",
            background: "#fff",
          });
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Gagal",
          text: err.response?.data?.message || "Gagal menghapus akun.",
          background: "#fff",
        });
      }
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header
        closeButton
        style={{ background: "#fff", borderBottom: "1px solid #f0f0f0" }}
      >
        <Modal.Title style={{ color: "#222" }}>Edit Profil</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ background: "#fff" }}>
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

        {/* Tombol Ganti Password & Hapus Akun */}
        <div className="mt-3 d-flex justify-content-between">
          <Button
            variant="primary"
            size="sm"
            className="d-flex align-items-center gap-2 rounded-pill px-3"
            onClick={() => setShowPassword(!showPassword)}
            style={{ fontWeight: 500 }}
          >
            <FaKey />
            Ganti Password
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="d-flex align-items-center gap-2 rounded-pill px-3"
            onClick={handleDeleteAccount}
            style={{ fontWeight: 500 }}
          >
            <FaTrash />
            Hapus Akun
          </Button>
        </div>

        {/* Form Ganti Password */}
        {showPassword && (
          <Form className="mt-3" onSubmit={handlePasswordChange}>
            <Form.Group className="mb-2">
              <div className="input-group">
                <Form.Control
                  type={showOldPassword ? "text" : "password"}
                  placeholder="Password Lama"
                  value={passwordData.oldPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      oldPassword: e.target.value,
                    })
                  }
                  required
                />
                <span
                  className="input-group-text"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowOldPassword((prev) => !prev)}
                >
                  {showOldPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </Form.Group>
            <Form.Group className="mb-2">
              <div className="input-group">
                <Form.Control
                  type={showNewPassword ? "text" : "password"}
                  placeholder="Password Baru"
                  value={passwordData.newPassword}
                  onChange={(e) =>
                    setPasswordData({
                      ...passwordData,
                      newPassword: e.target.value,
                    })
                  }
                  required
                  minLength={6}
                />
                <span
                  className="input-group-text"
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowNewPassword((prev) => !prev)}
                >
                  {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                </span>
              </div>
            </Form.Group>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              disabled={passwordLoading}
            >
              {passwordLoading ? "Menyimpan..." : "Simpan Password"}
            </Button>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default EditProfileModal;
