import "./App.css";
import "./index.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AppRoutes from "./routes/AppRoutes";
import ErrorBoundary from "./components/ErrorBoundary";
import { useEffect } from "react";

function App() {
  useEffect(() => {
    // Prevent context menu
    const handleContextMenu = (e) => {
      e.preventDefault();
    };

    // Prevent keyboard shortcuts
    const handleKeyDown = (e) => {
      // Allow keyboard shortcuts in input fields
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") {
        return;
      }

      // Prevent Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+A
      if (
        e.ctrlKey &&
        (e.key === "c" || e.key === "v" || e.key === "x" || e.key === "a")
      ) {
        e.preventDefault();
      }
    };

    // Add event listeners
    document.addEventListener("contextmenu", handleContextMenu);
    document.addEventListener("keydown", handleKeyDown);

    // Clean up
    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <ErrorBoundary>
      <Navbar />
      <AppRoutes />
      <Footer />
    </ErrorBoundary>
  );
}

export default App;
