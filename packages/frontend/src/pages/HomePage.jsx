// packages/frontend/src/pages/HomePage.jsx

import React from 'react';

function HomePage() {
  const handleLogin = () => {
    // This now uses the live backend URL from your Vercel environment variables
    const liveBackendUrl = import.meta.env.VITE_API_BASE_URL;
    window.location.href = `${liveBackendUrl}/api/v1/auth/tiktok`;
  };

  return (
    <div className="App">
      <h1>Welcome to AI Co-Pilot 🤖</h1>
      <p>Your strategic partner for TikTok content.</p>
      <button onClick={handleLogin} className="task-button" style={{ padding: '12px 24px', fontSize: '1rem' }}>
        Login with TikTok
      </button>
    </div>
  );
}

export default HomePage;