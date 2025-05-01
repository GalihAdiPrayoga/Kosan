import React from "react";
import { Table, Badge } from "react-bootstrap";

const PaymentsAdmin = () => {
  const dummyPayments = [
    {
      id: 1,
      user: "John Doe",
      amount: 1500000,
      status: "pending",
      date: "2024-01-28",
    },
    {
      id: 2,
      user: "Jane Smith",
      amount: 1800000,
      status: "success",
      date: "2024-01-27",
    },
  ];

  return (
    <div>
      <h2 className="mb-4">Daftar Pembayaran</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Pengguna</th>
            <th>Jumlah</th>
            <th>Status</th>
            <th>Tanggal</th>
          </tr>
        </thead>
        <tbody>
          {dummyPayments.map((payment) => (
            <tr key={payment.id}>
              <td>{payment.id}</td>
              <td>{payment.user}</td>
              <td>Rp {payment.amount.toLocaleString()}</td>
              <td>
                <Badge
                  bg={payment.status === "success" ? "success" : "warning"}
                >
                  {payment.status}
                </Badge>
              </td>
              <td>{payment.date}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default PaymentsAdmin;
