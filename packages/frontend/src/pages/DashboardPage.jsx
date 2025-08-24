// packages/frontend/src/pages/DashboardPage.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import apiClient from "../services/api.js";
import { setLogin, setLogout } from "../features/user/userSlice.js";
import ProfileCard from "../components/ProfileCard";
import TaskViewer from "../components/TaskViewer";
import OffersCard from "../components/OffersCard";

function DashboardPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  // This function can be passed to child components to trigger a refresh
  const fetchData = async () => {
    try {
      if (!profile) {
        const profileRes = await apiClient.get("/user/me");
        const { tikTokAccount, ...user } = profileRes.data.user;
        dispatch(setLogin({ profile: tikTokAccount, stars: user.stars }));
      }
    } catch (err) {
      console.error("Failed to load dashboard data", err);
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    dispatch(setLogout());
    navigate("/");
  };

  if (loading || !profile) {
    return <div>Loading Dashboard...</div>;
  }

  return (
    <>
      <header className="app-header">
        <h1>AI Co-Pilot</h1>

        {/* <div className="header-nav">
          <button
            className="nav-link-button"
            onClick={() => navigate("/dashboard")}
          >
            F4F
          </button>
          <button
            className="nav-link-button"
            onClick={() => navigate("/live-counter")}
          >
            Live Counter
          </button>
        </div> */}

        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </header>

      <main className="main-layout">
        {/* Left Column */}
        <ProfileCard />

        {/* Center Column */}
        <TaskViewer />

        {/* Right Column */}
        <aside>
          <OffersCard onCampaignCreated={fetchData} />

          <br />
          <div className="card">
            <h3 className="card-header">Buy Stars</h3>
            <p style={{ fontSize: "0.9rem", color: "#777" }}>
              Need more stars? Visit the store to purchase a pack.
            </p>
            <button
              style={{ width: "100%", marginTop: "10px" }}
              className="offer-button" // Using offer-button style for consistency
              onClick={() => navigate("/store")}
            >
              Go to Store
            </button>
          </div>
        </aside>
      </main>
    </>
  );
}

export default DashboardPage;
