import React, { useState, useEffect } from "react";
import Swal from 'sweetalert2'
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
} from "react-bootstrap";
import { FaTrash, FaSearch, FaFolder, FaEye } from "react-icons/fa";
import { API } from "../../api/config";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
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
      title: 'Apakah Anda yakin?',
      text: "Pengguna yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, hapus!',
      cancelButtonText: 'Batal',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        setLoading(true);
        await API.delete(`/users/${id}`);
        setUsers(users.filter((user) => user.id !== id));
        
        Swal.fire({
          title: 'Terhapus!',
          text: 'Pengguna berhasil dihapus.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire({
          title: 'Error!',
          text: 'Gagal menghapus pengguna.',
          icon: 'error',
          confirmButtonColor: '#dc3545'
        });
        setError("Gagal menghapus pengguna");
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
    <Container fluid className="py-4 px-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 fw-bold">Kelola Pengguna</h2>
      </div>

      {error && (
        <Alert variant="danger" className="mb-4">
          {error}
        </Alert>
      )}

      <Card className="shadow-sm border-0">
        <Card.Body className="p-4">
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
                />
              </InputGroup>
            </Col>
          </Row>

          {filteredUsers.length === 0 ? (
            <div className="text-center py-5">
              <div className="d-flex flex-column align-items-center">
                <div className="mb-3">
                  <FaFolder
                    size={64}
                    className="text-muted"
                    style={{ opacity: 0.5 }}
                  />
                </div>
                <div>
                  <h5 className="text-muted mb-1">Data Tidak Ditemukan</h5>
                  <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
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
                    <th className="py-3 px-2" style={{ width: "5%" }}>
                      No
                    </th>
                    <th className="py-3 px-2" style={{ width: "20%" }}>
                      Nama
                    </th>
                    <th className="py-3 px-2" style={{ width: "25%" }}>
                      Email
                    </th>
                    <th className="py-3 px-2" style={{ width: "15%" }}>
                      No. Telepon
                    </th>
                    <th className="py-3 px-2" style={{ width: "15%" }}>
                      Role
                    </th>
                    <th className="py-3 px-2" style={{ width: "15%" }}>
                      Aksi
                    </th>
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
                        </div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="text-truncate">{user.email}</div>
                      </td>
                      <td className="py-3 px-2">
                        <div className="text-truncate">{user.phone || "-"}</div>
                      </td>
                      <td className="py-3 px-2">
                        <span
                          className={`badge bg-${
                            user.role === "pemilik" ? "danger" : "info"
                          }`}
                        >
                          {user.role === "pemilik"
                            ? "Pemilik Kos"
                            : "Pencari Kos"}
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <div className="d-flex gap-2">
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => handleDelete(user.id)}
                            disabled={loading}
                            title="Hapus"
                          >
                            {loading ? (
                              <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                              />
                            ) : (
                              <FaTrash />
                            )}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ManageUsers;
