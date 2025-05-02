import React, { useState, useEffect } from "react";
import { Table, Badge } from "react-bootstrap";
import { API } from "../../api/config";

const PaymentsAdmin = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await API.get("/db.json");
        setPayments(response.data.payments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching payments:", error);
        setError("Failed to load payments");
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-danger">{error}</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Payment Management</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Booking ID</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.bookingId}</td>
              <td>Rp {payment.amount.toLocaleString()}</td>
              <td>
                <Badge bg={payment.status === "completed" ? "success" : "warning"}>
                  {payment.status}
                </Badge>
              </td>
              <td>{new Date(payment.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default PaymentsAdmin;
