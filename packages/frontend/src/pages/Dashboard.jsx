import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import apiClient from '../services/api.js';
import { setLogin, setLogout } from '../features/user/userSlice.js';

function Dashboard() {
  const { profile } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);

  useEffect(() => {
    if (localStorage.getItem('authToken') && !profile) {
      apiClient.get('/user/me')
        .then(response => {
          const userProfile = response.data.user.tikTokAccount;
          dispatch(setLogin(userProfile));
        })
        .catch(error => {
          console.error('Failed to fetch user:', error);
          handleLogout();
        });
    }
  }, [profile, dispatch]);

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    dispatch(setLogout());
    navigate('/');
  };

  const handleAnalysis = async () => {
    setIsLoading(true);
    setAnalysisResult(null);
    try {
      const response = await apiClient.post('/trends/analyze');
      setAnalysisResult(response.data.message); // <-- This line is now corrected
    } catch (error) {
      setAnalysisResult('Analysis failed. Please try again.');
      console.error('Analysis error:', error);
    }
    setIsLoading(false);
  };

  if (!localStorage.getItem('authToken')) {
    navigate('/');
    return null;
  }

  return (
    <div className="App">
      <h1>Dashboard</h1>
      {profile ? (
        <div>
          <h2>Welcome, {profile.username}!</h2>
          <img src={profile.avatarUrl} alt="User Avatar" style={{ borderRadius: '50%' }} />
          <p>You are successfully logged in.</p>

          <div style={{ marginTop: '30px' }}>

            <button 
            onClick={() => navigate('/trends')} 
            style={{ marginTop: '20px', marginRight: '10px' }}
          >
            View Trends
          </button>
          
            <button onClick={handleAnalysis} disabled={isLoading}>
              {isLoading ? 'Analyzing...' : 'Analyze My Trends'}
            </button>
            {analysisResult && (
              <p style={{ marginTop: '10px', color: '#888' }}>
                {analysisResult}
              </p>
            )}
          </div>

        </div>
      ) : (
        <p>Loading profile...</p>
      )}
      <button onClick={handleLogout} style={{ marginTop: '20px' }}>Logout</button>
    </div>
  );
}

export default Dashboard;