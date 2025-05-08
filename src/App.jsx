import "./App.css";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./components/Footer"; 
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary";
import AuthProvider from "./Auth/AuthProvider";

function App() {
  return (
    <AuthProvider>
      <ErrorBoundary>
        <AppRoutes />
        <Footer />
      </ErrorBoundary>
    </AuthProvider>
  );
}

export default App;
