import React from 'react';

function PrivacyPolicyPage() {
  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      <h1>Privacy Policy for AI Co-Pilot</h1>
      <p><strong>Last Updated:</strong> August 25, 2025</p>
      <p>This Privacy Policy describes how AI Co-Pilot ("we," "us," or "our") collects, uses, and discloses your information when you use our Live Follower Counter service (the "Service").</p>

      <h2>Information We Collect</h2>
      <p>To provide the Service, we require you to log in with your TikTok account. By doing so, you grant us permission to access specific information from your TikTok profile through the official TikTok API. The only information we collect and process is:</p>
      <ul>
        <li><strong>Public Profile Information:</strong> Your TikTok display name and avatar URL.</li>
        <li><strong>Public Account Statistics:</strong> Your live follower and following count.</li>
        <li><strong>Access Token:</strong> A secure token provided by TikTok that allows us to request your latest stats. We do not see or store your password.</li>
      </ul>

      <h2>How We Use Your Information</h2>
      <p>We use the information we collect for one single purpose: To display your live follower count to you on the Live Counter page of our application.</p>
      <p>We do not use your information for advertising, profiling, or any other purpose. We do not share your information with any third parties.</p>

      <h2>Revoking Access</h2>
      <p>You can revoke our application's access to your TikTok account at any time by going to the "Settings" -> "Security" -> "Manage app permissions" section within your official TikTok app or website. Revoking access will prevent our Service from functioning.</p>
    </div>
  );
}

export default PrivacyPolicyPage;