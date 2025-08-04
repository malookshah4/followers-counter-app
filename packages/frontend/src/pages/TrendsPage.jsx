// packages/frontend/src/pages/TrendsPage.jsx

import { useEffect, useState } from 'react';
import apiClient from '../services/api';
import { useNavigate } from 'react-router-dom';

function TrendsPage() {
  const [audioTrends, setAudioTrends] = useState([]);
  const [hashtagTrends, setHashtagTrends] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrends = async () => {
      try {
        const response = await apiClient.get('/trends');
        setAudioTrends(response.data.audioTrends);
        setHashtagTrends(response.data.hashtagTrends);
      } catch (error) {
        console.error('Failed to fetch trends:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrends();
  }, []);

  if (isLoading) {
    return <p>Loading trends...</p>;
  }

  return (
    <div className="App">
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px' }}>
        Back to Dashboard
      </button>
      <h1>Trends Dashboard</h1>

      <div style={{ display: 'flex', justifyContent: 'space-around', textAlign: 'left' }}>
        <div>
          <h2>Trending Sounds</h2>
          {audioTrends.length > 0 ? (
            <ul>
              {audioTrends.map(trend => (
                <li key={trend.id}>{trend.title} - by {trend.author} (Count: {trend.count})</li>
                
              ))}
            </ul>
          ) : (
            <p>No audio trends found. Analyze some videos first!</p>
          )}
        </div>
        <div>
          <h2>Trending Hashtags</h2>
          {hashtagTrends.length > 0 ? (
            <ul>
              {hashtagTrends.map(trend => (
                <li key={trend.id}>#{trend.name} (Count: {trend.count})</li>
              ))}
            </ul>
          ) : (
            <p>No hashtag trends found. Analyze some videos first!</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default TrendsPage;