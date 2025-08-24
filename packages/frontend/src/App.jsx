// packages/frontend/src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthCallback from "./pages/AuthCallback";
import DashboardPage from "./pages/DashboardPage";
import StorePage from "./pages/StorePage";
import "./App.css";
import AuthenticatedRoutes from "./AuthenticatedRoutes.jsx";
import LiveCounterPage from "./pages/LiveCounterPage";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Authenticated Routes */}
          <Route element={<AuthenticatedRoutes />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/live-counter" element={<LiveCounterPage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;