import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

const LoadingSpinner = () => {
  return (
    <Container className="loading-container d-flex justify-content-center align-items-center">
      <div className="text-center">
        <Spinner animation="border" variant="primary" className="mb-2" />
        <p className="loading-text">Memuat data...</p>
      </div>
    </Container>
  );
};

export default LoadingSpinner;