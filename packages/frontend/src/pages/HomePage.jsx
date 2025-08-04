import React from 'react';

function HomePage() {
  const handleLogin = () => {
    // This link points to our backend, which will then redirect the user to TikTok
    window.location.href = 'http://localhost:8080/api/v1/auth/tiktok';
  };

  return (
    <div className="App">
      <h1>Welcome to AI Creator Co-Pilot 🤖</h1>
      <p>Your strategic partner for TikTok content.</p>
      <button onClick={handleLogin} style={{ padding: '10px 20px', fontSize: '16px' }}>
        Login with TikTok
      </button>
    </div>
  );
}

export default HomePage;