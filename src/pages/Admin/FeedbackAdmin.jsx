import React, { useState, useEffect } from "react";
import {
  Container,
  Card,
  Table,
  Badge,
  Button,
  Spinner,
  Alert,
  Modal,
  Form,
} from "react-bootstrap";
import { API } from "../../api/config";

const FeedbackAdmin = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState("");

  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      const response = await API.get("/pengaduans");
      setComplaints(response.data);
      setError("");
    } catch (err) {
      setError("Gagal memuat data pengaduan");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    try {
      await API.patch(`/pengaduans/${selectedComplaint.id}`, {
        status: statusUpdate,
      });

      setShowModal(false);
      fetchComplaints();
    } catch (err) {
      setError("Gagal mengupdate status pengaduan");
    }
  };

  const getStatusBadge = (status) => {
    const variants = {
      menunggu: "warning",
      diproses: "info",
      selesai: "success",
    };

    return (
      <Badge bg={variants[status] || "secondary"}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm">
        <Card.Body>
          <h2 className="mb-4">Manajemen Pengaduan</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          <Table responsive hover>
            <thead>
              <tr>
                <th>No</th>
                <th>Pengguna</th>
                <th>Kos</th>
                <th>Pengaduan</th>
                <th>Tanggal</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {complaints.map((complaint, index) => (
                <tr key={complaint.id}>
                  <td>{index + 1}</td>
                  <td>{complaint.user?.name}</td>
                  <td>{complaint.kosan?.nama_kosan}</td>
                  <td>{complaint.isi_pengaduan}</td>
                  <td>
                    {new Date(complaint.created_at).toLocaleDateString("id-ID")}
                  </td>
                  <td>{getStatusBadge(complaint.status)}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => {
                        setSelectedComplaint(complaint);
                        setStatusUpdate(complaint.status);
                        setShowModal(true);
                      }}
                    >
                      Update Status
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
      </Card>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Update Status Pengaduan</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Status</Form.Label>
            <Form.Select
              value={statusUpdate}
              onChange={(e) => setStatusUpdate(e.target.value)}
            >
              <option value="menunggu">Menunggu</option>
              <option value="diproses">Diproses</option>
              <option value="selesai">Selesai</option>
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Batal
          </Button>
          <Button variant="primary" onClick={handleUpdateStatus}>
            Simpan
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FeedbackAdmin;
