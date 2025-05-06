import React, { useState, useEffect } from "react";
import { 
  Container, 
  Table, 
  Button, 
  Badge, 
  Alert, 
  Card, 
  Spinner 
} from "react-bootstrap";
import { FaEdit, FaTrash, FaUserPlus } from "react-icons/fa";
import { API } from "../../api/config";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
    <Container fluid className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Kelola Pengguna</h2>
            <Button
              variant="primary"
              className="d-flex align-items-center gap-2"
            >
              <FaUserPlus /> Tambah Pengguna
            </Button>
          </div>

          {error && <Alert variant="danger" className="mb-4">{error}</Alert>}

          {users.length === 0 ? (
            <Alert variant="info">Belum ada data pengguna.</Alert>
          ) : (
            <Table responsive hover>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Nama</th>
                  <th>Email</th>
                  <th>No. Telepon</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, index) => (
                  <tr key={user.id}>
                    <td>{index + 1}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.phone || "-"}</td>
                    <td>
                      <Badge bg={
                        user.role === "admin" 
                          ? "primary"
                          : user.role === "pemilik"
                            ? "success"
                            : "info"
                      }>
                        {user.role}
                      </Badge>
                    </td>
                    <td>
                      <Badge bg={user.status === "active" ? "success" : "danger"}>
                        {user.status}
                      </Badge>
                    </td>
                    <td>
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
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ManageUsers;
