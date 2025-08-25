// packages/frontend/src/pages/HomePage.jsx

import React from "react";
import { Link } from 'react-router-dom';

function HomePage() {
  const handleLogin = () => {
    // This now uses the live backend URL from your Vercel environment variables
    const liveBackendUrl = import.meta.env.VITE_API_BASE_URL;
    window.location.href = `${liveBackendUrl}/api/v1/auth/tiktok`;
  };

  return (
    <div className="App">
      <div>
        <h1>Welcome to AI Co-Pilot 🤖</h1>
        <p>Your strategic partner for TikTok content.</p>
        <button
          onClick={handleLogin}
          className="task-button"
          style={{ padding: "12px 24px", fontSize: "1rem" }}
        >
          Login with TikTok
        </button>
      </div>
      <dive>
        <footer style={{ padding: "20px", textAlign: "center", color: "#777" }}>
          <Link to="/privacy" style={{ marginRight: "15px" }}>
            Privacy Policy
          </Link>
          <Link to="/terms">Terms of Service</Link>
        </footer>
      </dive>
    </div>
  );
}

export default HomePage;
