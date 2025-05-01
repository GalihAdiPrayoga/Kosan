import React from "react";
import { Row, Col, Card } from "react-bootstrap";

const DashboardAdmin = () => {
  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      <Row>
        <Col md={3} className="mb-4">
          <Card className="text-center">
            <Card.Body>
              <h3>150</h3>
              <p>Total Kos</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="text-center">
            <Card.Body>
              <h3>50</h3>
              <p>Total Pengguna</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="text-center">
            <Card.Body>
              <h3>Rp 15M</h3>
              <p>Total Pendapatan</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-4">
          <Card className="text-center">
            <Card.Body>
              <h3>25</h3>
              <p>Transaksi Pending</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardAdmin;
