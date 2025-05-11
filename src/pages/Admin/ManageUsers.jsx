import React, { useState, useEffect } from "react";
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
import { FaEdit, FaTrash, FaSearch, FaFolder, FaEye } from "react-icons/fa";
import { API } from "../../api/config";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRole, setSelectedRole] = useState("all"); // New state for role filter
  const [searchTerm, setSearchTerm] = useState(""); // New state for search
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await API.get("/db.json");
      setUsers(response.data.users);
      setLoading(false);
    } catch (err) {
      setError("Gagal memuat data pengguna");
      console.error("Error:", err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus pengguna ini?")) {
      try {
        setLoading(true);
        await API.delete(`/users/${id}`);
        setUsers(users.filter((user) => user.id !== id));
        setLoading(false);
      } catch (err) {
        setError("Gagal menghapus pengguna");
        setLoading(false);
      }
    }
  };

  // Filter users based on role and search term
  const filteredUsers = users.filter((user) => {
    // Filter out admin users first
    if (user.role === "admin") return false;

    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.phone?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRole && matchesSearch;
  });

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
                      ? `Tidak ada hasil untuk pencarian "${searchTerm}"`
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
                            variant="outline-primary"
                            size="sm"
                            title="Edit"
                          >
                            <FaEdit />
                          </Button>
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

              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-4">
                  <Pagination size="sm">
                    <Pagination.First
                      onClick={() => setCurrentPage(1)}
                      disabled={currentPage === 1}
                    />
                    <Pagination.Prev
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    />
                    {[...Array(totalPages)].map((_, idx) => (
                      <Pagination.Item
                        key={idx + 1}
                        active={idx + 1 === currentPage}
                        onClick={() => setCurrentPage(idx + 1)}
                      >
                        {idx + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    />
                    <Pagination.Last
                      onClick={() => setCurrentPage(totalPages)}
                      disabled={currentPage === totalPages}
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ManageUsers;
