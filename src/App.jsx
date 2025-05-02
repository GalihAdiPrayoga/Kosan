import "./App.css";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <AppRoutes />
      <Footer />
    </ErrorBoundary>
  );
}

export default App;
