// packages/frontend/src/App.jsx

import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AuthCallback from "./pages/AuthCallback";
import DashboardPage from "./pages/DashboardPage";
import StorePage from "./pages/StorePage";
import EarnStarsPage from "./pages/EarnStarsPage";
import CampaignsPage from "./pages/CampaignsPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import LiveCounterPage from "./pages/LiveCounterPage";
import AuthenticatedRoutes from "./AuthenticatedRoutes.jsx";
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'; // <-- Add this
import TermsOfServicePage from './pages/TermsOfServicePage';
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <div className="app-container">
        <Routes>
          {/* Public routes that anyone can see */}
          <Route path="/" element={<HomePage />} />
          <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/privacy" element={<PrivacyPolicyPage />} /> {/* <-- Add this */}
          <Route path="/terms" element={<TermsOfServicePage />} />

          {/* These routes are protected and only visible after logging in */}
          <Route element={<AuthenticatedRoutes />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/campaigns" element={<CampaignsPage />} />
            <Route path="/earn" element={<EarnStarsPage />} />
            <Route path="/store" element={<StorePage />} />
            <Route path="/order/success" element={<OrderSuccessPage />} />
            <Route path="/live-counter" element={<LiveCounterPage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;