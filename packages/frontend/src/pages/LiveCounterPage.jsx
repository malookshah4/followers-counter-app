// packages/frontend/src/pages/LiveCounterPage.jsx

import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
import apiClient from "../services/api.js";
import { FaArrowLeft } from "react-icons/fa";

const AnimatedDigit = ({ digit, size }) => {
  // The style now uses the dynamic 'size' variable
  const style = { transform: `translateY(-${digit * size}rem)` };
  return (
    <div className="digit-container" style={{ height: `${size}rem` }}>
      <div className="digit-reel" style={style}>
        <span
          style={{
            fontSize: `${size}rem`,
            height: `${size}rem`,
            lineHeight: `${size}rem`,
          }}
        >
          0
        </span>
        <span
          style={{
            fontSize: `${size}rem`,
            height: `${size}rem`,
            lineHeight: `${size}rem`,
          }}
        >
          1
        </span>
        <span
          style={{
            fontSize: `${size}rem`,
            height: `${size}rem`,
            lineHeight: `${size}rem`,
          }}
        >
          2
        </span>
        <span
          style={{
            fontSize: `${size}rem`,
            height: `${size}rem`,
            lineHeight: `${size}rem`,
          }}
        >
          3
        </span>
        <span
          style={{
            fontSize: `${size}rem`,
            height: `${size}rem`,
            lineHeight: `${size}rem`,
          }}
        >
          4
        </span>
        <span
          style={{
            fontSize: `${size}rem`,
            height: `${size}rem`,
            lineHeight: `${size}rem`,
          }}
        >
          5
        </span>
        <span
          style={{
            fontSize: `${size}rem`,
            height: `${size}rem`,
            lineHeight: `${size}rem`,
          }}
        >
          6
        </span>
        <span
          style={{
            fontSize: `${size}rem`,
            height: `${size}rem`,
            lineHeight: `${size}rem`,
          }}
        >
          7
        </span>
        <span
          style={{
            fontSize: `${size}rem`,
            height: `${size}rem`,
            lineHeight: `${size}rem`,
          }}
        >
          8
        </span>
        <span
          style={{
            fontSize: `${size}rem`,
            height: `${size}rem`,
            lineHeight: `${size}rem`,
          }}
        >
          9
        </span>
      </div>
    </div>
  );
};
const Comma = ({ size }) => (
  <div
    style={{ fontSize: `${size - 1}rem`, color: "#fff", paddingBottom: "10px" }}
  >
    ,
  </div>
);

function LiveCounterPage() {
  // const navigate = useNavigate();
  const { profile } = useSelector((state) => state.user);
  const [followerCount, setFollowerCount] = useState(
    profile?.follower_count || 0
  );

  const isMobile = window.innerWidth <= 768;
  const digitSizeRem = isMobile ? 4 : 7; // Use 4rem on mobile, 7rem on desktop
  const [layout, setLayout] = useState("vertical");

  const prevCountRef = useRef(followerCount);

  useEffect(() => {
    prevCountRef.current = followerCount;
  }, [followerCount]);

  const [isFakeMode, setIsFakeMode] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [settings, setSettings] = useState({ min: 1, max: 5 });
  const [tempSettings, setTempSettings] = useState({ min: 1, max: 5 });

  useEffect(() => {
    let intervalId;
    if (!isFakeMode) {
      apiClient
        .get("/user/live-stats")
        .then((res) => setFollowerCount(res.data.follower_count));
      intervalId = setInterval(() => {
        apiClient
          .get("/user/live-stats")
          .then((res) => setFollowerCount(res.data.follower_count));
      }, 5000);
    }
    return () => clearInterval(intervalId);
  }, [isFakeMode]);

  useEffect(() => {
    let intervalId;
    if (isFakeMode) {
      intervalId = setInterval(() => {
        const increase =
          Math.floor(Math.random() * (settings.max - settings.min + 1)) +
          settings.min;
        setFollowerCount((prevCount) => prevCount + increase);
      }, 2500);
    }
    return () => clearInterval(intervalId);
  }, [isFakeMode, settings]);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSettings(tempSettings);
    setSettingsOpen(false);
  };

  // --- NEW HANDLER FOR THE SWITCH ---
  const handleToggleFakeMode = () => {
    const newMode = !isFakeMode;
    setIsFakeMode(newMode);
    // If we are turning fake mode ON, also open the settings dialog
    if (newMode) {
      setTempSettings(settings); // Sync temp state before opening
      setSettingsOpen(true);
    }
  };

  const digits = followerCount.toLocaleString().split("");

  //  <button className="back-to-dash-button" onClick={() => navigate('/dashboard')}>
  //       <FaArrowLeft size={18} /> {/* Use the icon */}
  //     </button>

  return (
    <div className="live-counter-fullscreen">
   

      <div className="layout-switcher">
        <select value={layout} onChange={(e) => setLayout(e.target.value)}>
          <option value="vertical">Vertical Layout</option>
          <option value="horizontal">Horizontal Layout</option>
        </select>
      </div>
      

      <div className={`live-counter-content ${layout}`}>
        <div className="counter-profile">
          <img src={profile?.avatarUrl} alt="User Avatar" className="counter-avatar" />
          <h2 className="counter-username">@{profile?.username}</h2>
          {layout === 'vertical' && (
            <p className="counter-label">Live Follower Count</p>
          )}
        </div>

        <div className="full-counter-display">
          {digits.map((char, index) =>
              char === ',' 
                  ? <Comma key={`comma-${index}`} size={digitSizeRem} /> 
                  : <AnimatedDigit key={index} digit={char} size={digitSizeRem} />
          )}
        </div>
      </div>

      {/* The customize switch and dialog UI remains the same */}
      <div className="customize-switch">
        <span
          onClick={() => {
            setTempSettings(settings);
            setSettingsOpen(true);
          }}
          style={{ cursor: "pointer" }}
        >
          Customize {isFakeMode ? "(On)" : "(Off)"}
        </span>
        <label className="switch">
          <input
            type="checkbox"
            checked={isFakeMode}
            onChange={() => setIsFakeMode(!isFakeMode)}
          />
          <span className="slider"></span>
        </label>
      </div>

      <div className="customize-switch">
        {/* The text can also open the dialog */}
        <span
          onClick={() => {
            setTempSettings(settings);
            setSettingsOpen(true);
          }}
          style={{ cursor: "pointer" }}
        >
          Customize {isFakeMode ? "(On)" : "(Off)"}
        </span>
        <label className="switch">
          <input
            type="checkbox"
            checked={isFakeMode}
            onChange={handleToggleFakeMode} // Use the new handler
          />
          <span className="slider"></span>
        </label>
      </div>

      {/* The dialog JSX remains the same */}
      {settingsOpen && (
        <div className="dialog-backdrop">
          <div className="dialog-content">
            <h2>Customize Fake Counter</h2>
            <p>
              Set the range for the fake follower increase when Customize mode
              is On.
            </p>
            <form onSubmit={handleSaveSettings}>
              <label>Minimum Increase:</label>
              <input
                type="number"
                value={tempSettings.min}
                onChange={(e) =>
                  setTempSettings({
                    ...tempSettings,
                    min: Number(e.target.value) || 0,
                  })
                }
              />
              <label>Maximum Increase:</label>
              <input
                type="number"
                value={tempSettings.max}
                onChange={(e) =>
                  setTempSettings({
                    ...tempSettings,
                    max: Number(e.target.value) || 0,
                  })
                }
              />
              <div className="dialog-actions">
                <button
                  type="button"
                  className="button-secondary"
                  onClick={() => setSettingsOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="button-primary">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default LiveCounterPage;
