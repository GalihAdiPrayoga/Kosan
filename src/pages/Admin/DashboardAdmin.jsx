import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Spinner, Alert } from "react-bootstrap";
import {
  FaHome,
  FaUsers,
  FaMoneyBillWave,
  FaClock,
  FaChartLine,
} from "react-icons/fa";
import { API } from "../../api/config";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const StatCard = ({ title, value, icon, color }) => (
  <Col xs={12} sm={6} md={3}>
    <Card className="h-100 shadow-sm">
      <Card.Body>
        <div className="d-flex align-items-center">
          <div className={`rounded-circle p-3 bg-${color} bg-opacity-10 me-3`}>
            <div className={`text-${color}`}>{icon}</div>
          </div>
          <div>
            <h6 className="mb-1 text-muted">{title}</h6>
            <h4 className="mb-0 fw-bold">{value}</h4>
          </div>
        </div>
      </Card.Body>
    </Card>
  </Col>
);

const SummaryCard = ({ stats }) => (
  <Card className="shadow-sm">
    <Card.Body>
      <h5 className="mb-4">Ringkasan</h5>
      <div className="d-flex justify-content-between mb-3">
        <span>Total Kos Aktif</span>
        <span className="fw-bold">{stats.totalKos}</span>
      </div>
      <div className="d-flex justify-content-between mb-3">
        <span>Total Pengguna</span>
        <span className="fw-bold">{stats.totalUsers}</span>
      </div>
      <div className="d-flex justify-content-between mb-3">
        <span>Pemilik Kos</span>
        <span className="fw-bold text-danger">{stats.totalPemilik}</span>
      </div>
      <div className="d-flex justify-content-between mb-3">
        <span>Pencari Kos</span>
        <span className="fw-bold text-info">{stats.totalPencari}</span>
      </div>
      <div className="d-flex justify-content-between mb-3">
        <span>Pembayaran Pending</span>
        <span className="fw-bold">{stats.pendingPayments}</span>
      </div>
      <div className="d-flex justify-content-between">
        <span>Total Pendapatan</span>
        <span className="fw-bold text-success">
          Rp {new Intl.NumberFormat("id-ID").format(stats.totalIncome)}
        </span>
      </div>
    </Card.Body>
  </Card>
);

const StatisticsCard = ({ payments }) => {
  // Process payment data for monthly income
  const getMonthlyData = () => {
    const months = [];
    const values = [];
    const today = new Date();

    // Create array of last 6 months
    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const monthName = month.toLocaleString("id-ID", { month: "short" });
      months.push(monthName);

      // Calculate total income for each month
      const monthPayments = payments
        .filter((payment) => {
          const paymentDate = new Date(payment.createdAt);
          return (
            paymentDate.getMonth() === month.getMonth() &&
            paymentDate.getFullYear() === month.getFullYear() &&
            payment.status === "diterima" // Only count accepted payments
          );
        })
        .reduce((sum, payment) => sum + Number(payment.total_harga), 0);

      values.push(monthPayments);
    }
    return { months, values };
  };

  const { months, values } = getMonthlyData();

  const chartData = {
    labels: months,
    datasets: [
      {
        label: "Pendapatan Bulanan",
        data: values,
        fill: true,
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgb(75, 192, 192)",
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: "rgb(75, 192, 192)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const value = context.raw;
            return `Pendapatan: Rp ${new Intl.NumberFormat("id-ID").format(value)}`;
          },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: (value) => `Rp ${new Intl.NumberFormat("id-ID").format(value)}`,
        },
        title: {
          display: true,
          text: "Pendapatan (Rp)",
        },
      },
      x: {
        title: {
          display: true,
          text: "Bulan",
        },
      },
    },
  };

  // Calculate total and average income
  const totalIncome = values.reduce((sum, value) => sum + value, 0);
  const averageIncome = totalIncome / values.length;

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0">
            <FaChartLine className="me-2" />
            Statistik Pendapatan
          </h5>
          <div className="text-end">
            <div className="small text-muted">Total Pendapatan</div>
            <div className="fw-bold">
              Rp {new Intl.NumberFormat("id-ID").format(totalIncome)}
            </div>
          </div>
        </div>
        <Line data={chartData} options={options} />
        <div className="mt-3 text-center text-muted">
          <small>
            Rata-rata pendapatan bulanan: Rp{" "}
            {new Intl.NumberFormat("id-ID").format(Math.round(averageIncome))}
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

const DashboardAdmin = () => {
  const [stats, setStats] = useState({
    totalKos: 0,
    totalUsers: 0,
    totalIncome: 0,
    pendingPayments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [payments, setPayments] = useState([]);

  const statCards = [
    {
      title: "Total Kos",
      value: stats.totalKos,
      icon: <FaHome size={24} />,
      color: "primary",
    },
    {
      title: "Total Pengguna",
      value: stats.totalUsers,
      icon: <FaUsers size={24} />,
      color: "success",
    },
    {
      title: "Total Pendapatan",
      value: `Rp ${new Intl.NumberFormat("id-ID").format(stats.totalIncome)}`,
      icon: <FaMoneyBillWave size={24} />,
      color: "info",
    },
    {
      title: "Pembayaran Pending",
      value: stats.pendingPayments,
      icon: <FaClock size={24} />,
      color: "warning",
    },
  ];

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const [kosResponse, usersResponse, paymentsResponse] = await Promise.all([
        API.get("/kosans"),
        API.get("/users"),
        API.get("/pembayarans"),
      ]);

      const totalKos = kosResponse.data.data.length;

      // Count users by role
      const users = usersResponse.data;
      const totalPemilik = users.filter(
        (user) => user.role === "pemilik"
      ).length;
      const totalPencari = users.filter((user) => user.role === "user").length;
      const totalUsers = totalPemilik + totalPencari;

      const payments = paymentsResponse.data;

      setStats({
        totalKos,
        totalUsers,
        totalPemilik,
        totalPencari,
        totalIncome: payments
          .filter((payment) => payment.status === "diterima")
          .reduce((sum, payment) => sum + Number(payment.total_harga), 0),
        pendingPayments: payments.filter(
          (payment) => payment.status === "pending"
        ).length,
      });
      setPayments(payments);
      setError(null);
    } catch (err) {
      console.error("Error fetching dashboard stats:", err);
      setError("Gagal memuat statistik dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Container fluid className="py-4">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Dashboard Admin</h2>
          <p className="text-muted mb-0">
            Selamat datang di panel kontrol admin
          </p>
        </div>
      </div>

      <Row className="g-4 mb-4">
        {statCards.map((card, index) => (
          <StatCard key={index} {...card} />
        ))}
      </Row>

      <Row className="g-4">
        <Col lg={8}>
          <StatisticsCard payments={payments} />
        </Col>
        <Col lg={4}>
          <SummaryCard stats={stats} />
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardAdmin;
