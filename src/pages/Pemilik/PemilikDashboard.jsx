import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Spinner,
  Alert,
  ProgressBar,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaMoneyBillWave,
  FaClock,
  FaChartLine,
  FaPlus,
  FaBookmark,
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

const StatsCard = ({ icon: Icon, title, value, color, percentage }) => (
  <Col md={3} className="mb-4">
    <Card className="h-100 stats-card border-0 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className={`rounded-circle p-3 bg-${color} bg-opacity-10`}>
            <Icon className={`text-${color}`} size={24} />
          </div>
          {percentage !== undefined && (
            <span className={`badge bg-${color} bg-opacity-10 text-${color}`}>
              {percentage > 0 ? "+" : ""}
              {percentage}%
            </span>
          )}
        </div>
        <h6 className="text-muted mb-2">{title}</h6>
        <h4 className="mb-0 fw-bold">{value}</h4>
        {percentage !== undefined && (
          <ProgressBar
            variant={color}
            now={Math.abs(percentage)}
            className="mt-3"
            style={{ height: "4px" }}
          />
        )}
      </Card.Body>
    </Card>
  </Col>
);

const RevenueChart = ({ data }) => {
  const chartData = {
    labels: data.labels,
    datasets: [
      {
        label: "Pendapatan Bulanan",
        data: data.values,
        fill: true,
        backgroundColor: "rgba(0, 123, 255, 0.1)",
        borderColor: "rgba(0, 123, 255, 0.7)",
        tension: 0.4,
        pointRadius: 4,
        pointBackgroundColor: "#fff",
        pointBorderColor: "rgba(0, 123, 255, 0.7)",
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleColor: "#fff",
        bodyColor: "#fff",
        borderColor: "rgba(255, 255, 255, 0.1)",
        borderWidth: 1,
        callbacks: {
          label: (context) =>
            `Pendapatan: Rp ${new Intl.NumberFormat("id-ID").format(
              context.raw
            )}`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
        },
        ticks: {
          callback: (value) =>
            `Rp ${new Intl.NumberFormat("id-ID").format(value)}`,
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return <Line data={chartData} options={options} />;
};

const PemilikDashboard = () => {
  const [stats, setStats] = useState({
    totalKos: 0,
    totalPenghuni: 0,
    totalPendapatan: 0,
    bookingPending: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartData, setChartData] = useState({
    labels: [],
    values: [],
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("User ID not found");

      const [kosResponse, paymentsResponse] = await Promise.all([
        API.get(`/kosans/owner/${userId}`),
        API.get(`/pembayarans/accepted/${userId}`),
      ]);

      const kosData = kosResponse.data.data || [];
      const paymentsData = paymentsResponse.data.data || [];

      // Process monthly revenue data
      const monthlyData = processMonthlyRevenue(paymentsData);

      setChartData({
        labels: monthlyData.months,
        values: monthlyData.values,
      });

      // Calculate growth percentages
      const previousMonthRevenue =
        monthlyData.values[monthlyData.values.length - 2] || 0;
      const currentMonthRevenue =
        monthlyData.values[monthlyData.values.length - 1] || 0;
      const revenueGrowth = previousMonthRevenue
        ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) *
          100
        : 0;

      setStats({
        totalKos: kosData.length,
        totalPenghuni: paymentsData.filter(
          (payment) => payment.status === "diterima"
        ).length,
        totalPendapatan: paymentsData.reduce(
          (sum, payment) => sum + payment.total_harga,
          0
        ),
        bookingPending: paymentsData.filter(
          (payment) => payment.status === "pending"
        ).length,
        revenueGrowth: Math.round(revenueGrowth),
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

  const processMonthlyRevenue = (payments) => {
    const months = [];
    const values = [];
    const today = new Date();

    for (let i = 5; i >= 0; i--) {
      const month = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(
        month.toLocaleString("id-ID", { month: "short", year: "2-digit" })
      );

      const monthlyRevenue = payments
        .filter((payment) => {
          const paymentDate = new Date(payment.createdAt);
          return (
            paymentDate.getMonth() === month.getMonth() &&
            paymentDate.getFullYear() === month.getFullYear() &&
            payment.status === "diterima"
          );
        })
        .reduce((sum, payment) => sum + payment.total_harga, 0);

      values.push(monthlyRevenue);
    }

    return { months, values };
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
    <Container fluid className="py-4 bg-light min-vh-100">
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">Dashboard Pemilik Kos</h2>
              <p className="text-muted mb-0">
                Selamat datang kembali di panel kontrol Anda
              </p>
            </div>
            <div>
              <Button
                as={Link}
                to="/pemilik/kos/add"
                variant="primary"
                className="d-flex align-items-center gap-2"
              >
                <FaPlus /> Tambah Kos Baru
              </Button>
            </div>
          </div>

          <Row className="g-3">
            <StatsCard
              icon={FaHome}
              title="Total Kos"
              value={stats.totalKos}
              color="primary"
            />
            <StatsCard
              icon={FaUsers}
              title="Total Penghuni"
              value={stats.totalPenghuni}
              color="success"
            />
            <StatsCard
              icon={FaMoneyBillWave}
              title="Total Pendapatan"
              value={`Rp ${new Intl.NumberFormat("id-ID").format(
                stats.totalPendapatan
              )}`}
              color="info"
              percentage={stats.revenueGrowth}
            />
            <StatsCard
              icon={FaClock}
              title="Booking Pending"
              value={stats.bookingPending}
              color="warning"
            />
          </Row>

          <Row className="mt-4">
            <Col lg={8}>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">
                      <FaChartLine className="me-2" />
                      Statistik Pendapatan
                    </h5>
                  </div>
                  <RevenueChart data={chartData} />
                </Card.Body>
              </Card>
            </Col>
            <Col lg={4}>
              <Card className="border-0 shadow-sm h-100">
                <Card.Body>
                  <h5 className="mb-4">Aksi Cepat</h5>
                  <div className="d-grid gap-3">
                    <Button
                      as={Link}
                      to="/pemilik/kos"
                      variant="outline-primary"
                      className="d-flex align-items-center justify-content-center gap-2"
                    >
                      <FaHome /> Kelola Kos
                    </Button>
                    <Button
                      as={Link}
                      to="/pemilik/bookings"
                      variant="outline-success"
                      className="d-flex align-items-center justify-content-center gap-2"
                    >
                      <FaBookmark /> Kelola Booking
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
