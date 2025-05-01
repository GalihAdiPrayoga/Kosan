import React from "react";
import { Alert, Button, Container } from "react-bootstrap";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container className="py-5">
          <Alert variant="danger">
            <Alert.Heading>Oops! Something went wrong</Alert.Heading>
            <p>{this.state.error?.message}</p>
            {process.env.NODE_ENV === "development" && (
              <pre className="mt-3 p-3 bg-light">
                {this.state.errorInfo?.componentStack}
              </pre>
            )}
            <hr />
            <div className="d-flex justify-content-end">
              <Button variant="outline-danger" onClick={this.handleReset}>
                Try Again
              </Button>
            </div>
          </Alert>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
