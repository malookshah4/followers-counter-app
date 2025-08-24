// packages/frontend/src/components/ProfileCard.jsx

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import apiClient from "../services/api.js";

function ProfileCard() {
  const { profile, stars } = useSelector((state) => state.user);
  const [myCampaigns, setMyCampaigns] = useState([]);

  useEffect(() => {
    // Fetch the user's campaigns specifically for this component
    apiClient
      .get("/campaigns/my-campaigns")
      .then((res) => setMyCampaigns(res.data))
      .catch((err) => console.error("Failed to fetch my campaigns", err));
  }, [stars,myCampaigns]);

  if (!profile) {
    return <div className="card profile-card">Loading Profile...</div>;
  }

  return (
    <aside className="card profile-card">
      <img
        src={profile.avatarUrl}
        alt="User Avatar"
        className="profile-avatar"
      />

      <h3 className="p-username">{profile.username}</h3>

      <div className="profile-stats">
        <div>
          <div className="stat-value">
            {profile.follower_count?.toLocaleString() || "..."}
          </div>
          <div className="stat-label">Followers</div>
        </div>
        <div>
          <div className="stat-value">
            {profile.following_count?.toLocaleString() || "..."}
          </div>
          <div className="stat-label">Following</div>
        </div>
      </div>

      <div className="stars-display">✨ {stars.toLocaleString()}</div>
      <div className="stat-label" style={{ marginBottom: "20px" }}>
        Stars
      </div>

      <div style={{ textAlign: "left" }}>
        <h4
          className="card-header"
          style={{ borderTop: "1px solid #e0e0e0", paddingTop: "15px" }}
        >
          Your Active Campaigns
        </h4>
        <ul className="campaign-list">
          {myCampaigns
            .filter((c) => c.status === "ACTIVE")
            .map((c) => (
              <li key={c.id} className="campaign-item">
                <div className="campaign-info">
                  <span className="campaign-main-text">
                    Get {c.totalAmount} {c.type}s
                  </span>
                  <span className="campaign-progress-text">
                    {c.currentAmount} / {c.totalAmount}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-bar-inner"
                    style={{
                      width: `${(c.currentAmount / c.totalAmount) * 100}%`,
                    }}
                  ></div>
                </div>
              </li>
            ))}
          {myCampaigns.filter((c) => c.status === "ACTIVE").length === 0 && (
            <p style={{ fontSize: "0.9rem", color: "#777" }}>
              No active campaigns.
            </p>
          )}
        </ul>
      </div>
    </aside>
  );
}

export default ProfileCard;
