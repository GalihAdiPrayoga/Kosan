import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaHome, FaUsers, FaMoneyBillWave, FaClock } from "react-icons/fa";
import { API } from "../../api/config";

const PemilikDashboard = () => {
  const [stats, setStats] = useState({
    totalKos: 0,
    totalPenghuni: 0,
    totalPendapatan: 0,
    bookingPending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found");
      }

      // Fetch kos data owned by the user
      const kosResponse = await API.get(`/kosans/owner/${userId}`);
      const kosData = kosResponse.data.data || [];

      // Fetch payments data
      const paymentsResponse = await API.get(`/pembayarans/accepted/${userId}`);
      const paymentsData = paymentsResponse.data.data || [];

      // Calculate statistics
      const totalKos = kosData.length;
      const totalPendapatan = paymentsData.reduce(
        (sum, payment) => sum + payment.total_harga,
        0
      );
      const totalPenghuni = paymentsData.filter(
        (payment) => payment.status === "diterima"
      ).length;
      const bookingPending = paymentsData.filter(
        (payment) => payment.status === "pending"
      ).length;

      setStats({
        totalKos,
        totalPenghuni,
        totalPendapatan,
        bookingPending,
      });

      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard data:", err);
      setError(
        "Gagal memuat data dashboard: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Container
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "80vh" }}
      >
        <Spinner animation="border" variant="primary" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <Row className="mb-4">
        <Col>
          <h2 className="mb-4">Dashboard Pemilik Kos</h2>

          <Row>
            {/* Stats Cards */}
            <Col md={3} className="mb-4">
              <Card className="h-100 shadow-sm hover-shadow">
                <Card.Body className="d-flex align-items-center">
                  <div className="rounded-circle p-3 bg-primary bg-opacity-10 me-3">
                    <FaHome className="text-primary" size={24} />
                  </div>
                  <div>
                    <h6 className="mb-1">Total Kos</h6>
                    <h4 className="mb-0">{stats.totalKos}</h4>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3} className="mb-4">
              <Card className="h-100 shadow-sm hover-shadow">
                <Card.Body className="d-flex align-items-center">
                  <div className="rounded-circle p-3 bg-success bg-opacity-10 me-3">
                    <FaUsers className="text-success" size={24} />
                  </div>
                  <div>
                    <h6 className="mb-1">Total Penghuni</h6>
                    <h4 className="mb-0">{stats.totalPenghuni}</h4>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3} className="mb-4">
              <Card className="h-100 shadow-sm hover-shadow">
                <Card.Body className="d-flex align-items-center">
                  <div className="rounded-circle p-3 bg-info bg-opacity-10 me-3">
                    <FaMoneyBillWave className="text-info" size={24} />
                  </div>
                  <div>
                    <h6 className="mb-1">Total Pendapatan</h6>
                    <h4 className="mb-0">
                      Rp{" "}
                      {new Intl.NumberFormat("id-ID").format(
                        stats.totalPendapatan
                      )}
                    </h4>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col md={3} className="mb-4">
              <Card className="h-100 shadow-sm hover-shadow">
                <Card.Body className="d-flex align-items-center">
                  <div className="rounded-circle p-3 bg-warning bg-opacity-10 me-3">
                    <FaClock className="text-warning" size={24} />
                  </div>
                  <div>
                    <h6 className="mb-1">Booking Pending</h6>
                    <h4 className="mb-0">{stats.bookingPending}</h4>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Quick Actions */}
          <Row className="mt-4">
            <Col md={12}>
              <Card className="shadow-sm">
                <Card.Body>
                  <h5 className="mb-4">Quick Actions</h5>
                  <div className="d-flex gap-3">
                    <Button
                      as={Link}
                      to="/pemilik/kos/add"
                      variant="primary"
                      className="d-flex align-items-center gap-2"
                    >
                      <FaHome /> Tambah Kos
                    </Button>
                    <Button
                      as={Link}
                      to="/pemilik/bookings"
                      variant="outline-primary"
                      className="d-flex align-items-center gap-2"
                    >
                      <FaUsers /> Lihat Booking
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Col>
      </Row>
    </Container>
  );
};

export default PemilikDashboard;
