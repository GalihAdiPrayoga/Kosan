import React, { useState, useEffect } from "react";
import { Table, Button, Badge, Alert } from "react-bootstrap";
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
    } catch (err) {
      setError("Failed to fetch users");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await API.delete(`/users/${id}`);
        setUsers(users.filter((user) => user.id !== id));
      } catch (err) {
        setError("Failed to delete user");
      }
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2 className="mb-4">Kelola Pengguna</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nama</th>
            <th>Email</th>
            <th>Role</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>
                <Badge bg={user.status === "active" ? "success" : "danger"}>
                  {user.status}
                </Badge>
              </td>
              <td>
                <Button variant="warning" size="sm" className="me-2">
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(user.id)}
                >
                  Hapus
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default ManageUsers;
