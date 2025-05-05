import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
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
      const response = await API.get("/db.json");
      const userId = localStorage.getItem("userId");
      const data = response.data;

      // Filter kos by owner ID
      const ownerKos = data.kos.filter(
        (kos) => kos.adminId.toString() === userId
      );

      // Calculate statistics
      const stats = {
        totalKos: ownerKos.length,
        totalPenghuni: calculateTotalPenghuni(data.bookings, ownerKos),
        totalPendapatan: calculateTotalPendapatan(data.payments, ownerKos),
        bookingPending: calculatePendingBookings(data.bookings, ownerKos),
      };

      setStats(stats);
      setLoading(false);
    } catch (error) {
      setError("Failed to load dashboard data");
      setLoading(false);
    }
  };

  const calculateTotalPenghuni = (bookings, ownerKos) => {
    const kosIds = ownerKos.map((kos) => kos.id);
    return bookings.filter(
      (booking) =>
        kosIds.includes(booking.kosId) && booking.status === "confirmed"
    ).length;
  };

  const calculateTotalPendapatan = (payments, ownerKos) => {
    const kosIds = ownerKos.map((kos) => kos.id);
    return payments
      .filter(
        (payment) =>
          kosIds.includes(payment.kosId) && payment.status === "completed"
      )
      .reduce((sum, payment) => sum + payment.amount, 0);
  };

  const calculatePendingBookings = (bookings, ownerKos) => {
    const kosIds = ownerKos.map((kos) => kos.id);
    return bookings.filter(
      (booking) =>
        kosIds.includes(booking.kosId) && booking.status === "pending"
    ).length;
  };

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
