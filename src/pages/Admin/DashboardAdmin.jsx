import React, { useState, useEffect } from "react";
import { Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHome,
  faUsers,
  faMoneyBillWave,
  faClock,
  faExclamationCircle,
  faChartLine,
  faBell,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";
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

  // Tambahkan state baru
  const [recentActivities] = useState([
    { id: 1, text: "Pembayaran baru dari John Doe", time: "5 menit yang lalu" },
    { id: 2, text: "Pemesanan kamar baru", time: "10 menit yang lalu" },
    { id: 3, text: "Update status pembayaran", time: "1 jam yang lalu" },
  ]);

  const [upcomingEvents] = useState([
    {
      id: 1,
      title: "Pembayaran Jatuh Tempo",
      date: "25 Mei 2025",
      room: "Kamar A1",
    },
    {
      id: 2,
      title: "Check-out Penghuni",
      date: "27 Mei 2025",
      room: "Kamar B2",
    },
    {
      id: 3,
      title: "Maintenance Rutin",
      date: "30 Mei 2025",
      room: "Semua Kamar",
    },
  ]);

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

  const cards = [
    {
      title: "Total Kos",
      value: stats.totalKos,
      icon: faHome,
      bgColor: "bg-gradient-to-r from-blue-500 to-blue-700",
    },
    {
      title: "Total Pengguna",
      value: stats.totalUsers,
      icon: faUsers,
      bgColor: "bg-gradient-to-r from-green-500 to-green-700",
    },
    {
      title: "Total Pendapatan",
      value: `Rp ${stats.totalIncome.toLocaleString("id-ID")}`,
      icon: faMoneyBillWave,
      bgColor: "bg-gradient-to-r from-cyan-500 to-cyan-700",
    },
    {
      title: "Transaksi Pending",
      value: stats.pendingPayments,
      icon: faClock,
      bgColor: "bg-gradient-to-r from-yellow-500 to-yellow-700",
    },
  ];

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Loading dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-3 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
        <FontAwesomeIcon icon={faExclamationCircle} className="mr-2" />
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard Admin</h2>
        <p className="text-gray-600">Selamat datang di panel kontrol admin</p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {cards.map((card, index) => (
          <div
            key={index}
            className="transform transition-all duration-200 hover:-translate-y-1"
          >
            <div className={`rounded-lg shadow-lg ${card.bgColor}`}>
              <div className="p-5">
                <div className="flex justify-between items-center">
                  <div className="text-white">
                    <div className="text-xs font-semibold uppercase tracking-wide mb-1">
                      {card.title}
                    </div>
                    <div className="text-2xl font-bold">{card.value}</div>
                  </div>
                  <div className="text-white opacity-80 hover:opacity-100 transition-opacity">
                    <FontAwesomeIcon icon={card.icon} size="2x" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">
              <FontAwesomeIcon icon={faChartLine} className="mr-2" />
              Grafik Pendapatan
            </h3>
            <select className="border rounded-md px-3 py-1 text-sm">
              <option>7 Hari Terakhir</option>
              <option>30 Hari Terakhir</option>
              <option>1 Tahun</option>
            </select>
          </div>
          <div className="h-64 bg-gray-50 rounded flex items-center justify-center">
            <p className="text-gray-500">Area Grafik</p>
          </div>
        </div>

        {/* Recent Activities Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <FontAwesomeIcon icon={faBell} className="mr-2" />
            Aktivitas Terbaru
          </h3>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="border-b pb-3 last:border-0">
                <p className="text-gray-700">{activity.text}</p>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="lg:col-span-3 bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            <FontAwesomeIcon icon={faCalendarCheck} className="mr-2" />
            Agenda Mendatang
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {upcomingEvents.map((event) => (
              <div
                key={event.id}
                className="border rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <h4 className="font-semibold text-gray-700">{event.title}</h4>
                <p className="text-sm text-gray-500">{event.date}</p>
                <p className="text-sm text-gray-600 mt-1">{event.room}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdmin;
