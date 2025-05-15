import React, { useState, useEffect } from "react";
import notFoundImage from "../../assets/notfound.jpg";
import Swal from "sweetalert2";
import {
  Container,
  Table,
  Button,
  Alert,
  Card,
  Spinner,
  Form,
  InputGroup,
  Pagination,
  Row,
  Col,
  Modal,
} from "react-bootstrap";
import { FaTrash, FaSearch, FaFolder, FaEye, FaEdit } from "react-icons/fa";
import { API } from "../../api/config";

const EditModal = React.memo(
  ({ show, onHide, editForm, setEditForm, handleUpdate, loading }) => (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Pengguna</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Nama</Form.Label>
            <Form.Control
              type="text"
              value={editForm.name}
              onChange={(e) => {
                e.persist();
                setEditForm((prev) => ({
                  ...prev,
                  name: e.target.value,
                }));
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              value={editForm.email}
              onChange={(e) => {
                e.persist();
                setEditForm((prev) => ({
                  ...prev,
                  email: e.target.value,
                }));
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>No. Telepon</Form.Label>
            <Form.Control
              type="text"
              value={editForm.nomor}
              onChange={(e) => {
                e.persist();
                setEditForm((prev) => ({
                  ...prev,
                  nomor: e.target.value,
                }));
              }}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Role</Form.Label>
            <Form.Select
              value={editForm.role}
              onChange={(e) => {
                e.persist();
                setEditForm((prev) => ({
                  ...prev,
                  role: e.target.value,
                }));
              }}
            >
              <option value="user">Pencari Kos</option>
              <option value="pemilik">Pemilik Kos</option>
            </Form.Select>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Batal
        </Button>
        <Button variant="primary" onClick={handleUpdate} disabled={loading}>
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                className="me-2"
              />
              Menyimpan...
            </>
          ) : (
            "Simpan Perubahan"
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  )
);

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [editForm, setEditForm] = useState({
    name: "",
    email: "",
    nomor: "",
    role: "",
  });
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUsers(); // Changed from fetchUser to fetchUsers
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await API.get("/users"); // Changed endpoint from /me to /users
      // Filter out admin users and transform data
      const filteredUsers = response.data
        .filter((user) => user.role === "pemilik" || user.role === "user")
        .map((user) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          phone: user.nomor || "-",
          role: user.role,
        }));

      setUsers(filteredUsers);
      setLoading(false);
    } catch (err) {
      setError("Gagal memuat data pengguna");
      console.error("Error:", err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data pengguna yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("Token tidak ditemukan");
        }

        await API.delete(`/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        });

        // Update the local state after successful deletion
        setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
        setFilteredUsers((prevFiltered) =>
          prevFiltered.filter((user) => user.id !== id)
        );

        // Show success message
        Swal.fire("Terhapus!", "Data pengguna berhasil dihapus.", "success");
      } catch (err) {
        console.error("Error deleting user:", err);
        Swal.fire("Error!", "Gagal menghapus data pengguna", "error");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    // Apply filters whenever users, selectedRole, or searchTerm changes
    const filtered = users.filter((user) => {
      const roleMatch =
        selectedRole === "all"
          ? user.role === "pemilik" || user.role === "user"
          : user.role === selectedRole;

      const searchMatch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone.toLowerCase().includes(searchTerm.toLowerCase());

      return roleMatch && searchMatch;
    });

    setFilteredUsers(filtered);
  }, [users, selectedRole, searchTerm]);

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    setEditForm({
      name: user.name,
      email: user.email,
      nomor: user.phone,
      role: user.role,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async () => {
    try {
      // Basic validation
      if (
        !editForm.name ||
        !editForm.email ||
        !editForm.nomor ||
        !editForm.role
      ) {
        throw new Error("Semua field harus diisi");
      }

      // Email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(editForm.email)) {
        throw new Error("Format email tidak valid");
      }

      // Phone number validation
      if (!editForm.nomor.startsWith("62")) {
        throw new Error("Nomor telepon harus diawali dengan 62");
      }

      setLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        throw new Error("Token tidak ditemukan");
      }

      const response = await API.put(
        `/users/${editingUser.id}`,
        {
          name: editForm.name.trim(),
          email: editForm.email.toLowerCase().trim(),
          nomor: editForm.nomor.trim(),
          role: editForm.role,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/json",
          },
        }
      );

      // Update local state without fetching
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === editingUser.id
            ? {
                ...user,
                name: editForm.name.trim(),
                email: editForm.email.toLowerCase().trim(),
                phone: editForm.nomor.trim(),
                role: editForm.role,
              }
            : user
        )
      );

      // Close modal first
      setShowEditModal(false);

      // Then show success message
      await Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Data pengguna berhasil diperbarui",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error("Error updating user:", err);
      await Swal.fire({
        icon: "error",
        title: "Gagal!",
        text:
          err.response?.data?.message ||
          err.message ||
          "Gagal memperbarui data pengguna",
        confirmButtonColor: "#d33",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    );
  }

  return (
    <Container fluid className="py-4 px-3 px-lg-4">
      {/* Title section with responsive margins */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
        <h2 className="mb-3 mb-md-0 fw-bold">Kelola Pengguna</h2>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Card className="shadow-sm border-0">
        <Card.Body className="p-3 p-md-4">
          {/* Filter and Search section with stacking on mobile */}
          <Row className="mb-4">
            <Col md={4}>
              <Form.Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="mb-3 mb-md-0"
              >
                <option value="all">Semua Pengguna</option>
                <option value="pemilik">Pemilik Kos</option>
                <option value="user">Pencari Kos</option>
              </Form.Select>
            </Col>
            <Col md={8}>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0">
                  <FaSearch className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  className="border-start-0 bg-light"
                  placeholder="Cari pengguna..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoComplete="off"
                />
              </InputGroup>
            </Col>
          </Row>

          {/* Responsive table wrapper */}
          <div className="table-responsive">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-5">
                <div className="d-flex flex-column align-items-center">
                  <div className="mb-4">
                    <img
                      src={notFoundImage}
                      alt="No Data Found"
                      style={{
                        width: "200px",
                        maxWidth: "100%",
                        height: "auto",
                        objectFit: "contain",
                        opacity: 0.9,
                        borderRadius: "8px",
                      }}
                    />
                  </div>
                  <div className="px-3">
                    <h5 className="text-muted mb-2">Data Tidak Ditemukan</h5>
                    <p className="text-muted mb-0 small">
                      {searchTerm
                        ? "Tidak ada pengguna yang sesuai dengan pencarian"
                        : "Tidak ada data pengguna yang tersedia"}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <Table hover className="mb-0">
                  <thead>
                    <tr className="bg-light">
                      <th className="py-3 px-2">No</th>
                      <th className="py-3 px-2">Nama</th>
                      <th className="py-3 px-2 d-none d-md-table-cell">
                        Email
                      </th>
                      <th className="py-3 px-2 d-none d-lg-table-cell">
                        Telepon
                      </th>
                      <th className="py-3 px-2">Role</th>
                      <th className="py-3 px-2">Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentUsers.map((user, index) => (
                      <tr key={user.id} className="align-middle">
                        <td className="py-3 px-2">
                          {(currentPage - 1) * itemsPerPage + index + 1}
                        </td>
                        <td className="py-3 px-2">
                          <div className="text-truncate fw-medium">
                            {user.name}
                            <div className="d-md-none small text-muted">
                              {user.email}
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-2 d-none d-md-table-cell">
                          <div className="text-truncate">{user.email}</div>
                        </td>
                        <td className="py-3 px-2 d-none d-lg-table-cell">
                          <div className="text-truncate">
                            {user.phone || "-"}
                          </div>
                        </td>
                        <td className="py-3 px-2">
                          <span
                            className={`badge bg-${
                              user.role === "pemilik" ? "danger" : "info"
                            }`}
                          >
                            {user.role === "pemilik" ? "Pemilik" : "Pencari"}
                          </span>
                        </td>
                        <td className="py-3 px-2">
                          <div className="d-flex gap-2">
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleEdit(user)}
                              disabled={loading}
                              className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: "32px", height: "32px" }}
                              title="Edit"
                            >
                              <FaEdit size={12} />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(user.id)}
                              disabled={loading}
                              className="rounded-circle d-flex align-items-center justify-content-center"
                              style={{ width: "32px", height: "32px" }}
                              title="Hapus"
                            >
                              {loading ? (
                                <Spinner animation="border" size="sm" />
                              ) : (
                                <FaTrash size={12} />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>

                {/* Responsive pagination */}
                {filteredUsers.length > 0 && (
                  <div className="d-flex justify-content-between align-items-center mt-4">
                    <div className="text-muted small">
                      Menampilkan {currentUsers.length} dari{" "}
                      {filteredUsers.length} data
                    </div>
                    <div className="pagination-container d-flex align-items-center gap-3">
                      <Button
                        variant="light"
                        size="sm"
                        onClick={handlePreviousPage}
                        disabled={currentPage === 1}
                        className="d-flex align-items-center px-3 py-2 rounded-pill shadow-sm border"
                      >
                        <i className="bi bi-chevron-left me-1"></i>
                        Prev
                      </Button>

                      <div className="d-flex align-items-center gap-2">
                        {Array.from({ length: totalPages }, (_, index) => (
                          <Button
                            key={index + 1}
                            variant={
                              currentPage === index + 1 ? "primary" : "light"
                            }
                            size="sm"
                            onClick={() => setCurrentPage(index + 1)}
                            className={`rounded-circle d-flex align-items-center justify-content-center p-0 ${
                              currentPage === index + 1
                                ? "shadow"
                                : "shadow-sm border"
                            }`}
                            style={{ width: "35px", height: "35px" }}
                          >
                            {index + 1}
                          </Button>
                        ))}
                      </div>

                      <Button
                        variant="light"
                        size="sm"
                        onClick={handleNextPage}
                        disabled={currentPage === totalPages}
                        className="d-flex align-items-center px-3 py-2 rounded-pill shadow-sm border"
                      >
                        Next
                        <i className="bi bi-chevron-right ms-1"></i>
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Card.Body>
      </Card>

      <EditModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        editForm={editForm}
        setEditForm={setEditForm}
        handleUpdate={handleUpdate}
        loading={loading}
      />
    </Container>
  );
};

export default ManageUsers;
