import React, { useState, useEffect } from "react";
import { Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import { API } from "../../api/config";

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    totalKos: 0,
    totalUsers: 0,
    totalIncome: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await API.get("/db.json");
      const data = response.data;

      // Calculate statistics from API data
      const stats = {
        totalKos: data.kos.length,
        totalUsers: data.users.filter((user) => user.role === "user").length,
        totalIncome: data.payments
          .filter((payment) => payment.status === "completed")
          .reduce((sum, payment) => sum + payment.amount, 0),
        pendingPayments: data.payments.filter(
          (payment) => payment.status === "pending"
        ).length,
      };

      setStats(stats);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
      setError("Failed to load dashboard statistics");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="my-3">
        {error}
      </Alert>
    );
  }

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      <Row>
        <Col md={3} className="mb-4">
          <Card className="text-center">
            <Card.Body>
              <h3>{stats.totalKos}</h3>
              <p>Total Kos</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="text-center">
            <Card.Body>
              <h3>{stats.totalUsers}</h3>
              <p>Total Pengguna</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="text-center">
            <Card.Body>
              <h3>Rp {stats.totalIncome.toLocaleString("id-ID")}</h3>
              <p>Total Pendapatan</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="text-center">
            <Card.Body>
              <h3>{stats.pendingPayments}</h3>
              <p>Transaksi Pending</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardAdmin;
