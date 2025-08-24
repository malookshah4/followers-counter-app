import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import apiClient from '../services/api';
import { updateStars } from '../features/user/userSlice';

function CampaignsPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [type, setType] = useState('FOLLOW'); // Default to FOLLOW campaign
  const [targetUrl, setTargetUrl] = useState('');
  const [totalAmount, setTotalAmount] = useState(10); // Default to 10
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await apiClient.post('/campaigns', {
        type,
        targetUrl,
        totalAmount: Number(totalAmount),
      });

      // After successful creation, fetch the updated user data to get the new star balance
      const userResponse = await apiClient.get('/user/me');
      dispatch(updateStars(userResponse.data.user.stars));

      alert('Campaign created successfully!');
      navigate('/dashboard'); // Go back to the dashboard

    } catch (err) {
      // Set the error message from the backend response
      setError(err.response?.data?.message || 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px' }}>
        Back to Dashboard
      </button>
      <h1>Create a New Campaign</h1>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '400px', margin: 'auto' }}>
        <label>
          Campaign Type:
          <select value={type} onChange={(e) => setType(e.target.value)}>
            <option value="FOLLOW">Get Followers</option>
            <option value="LIKE">Get Likes</option>
          </select>
        </label>
        <label>
          TikTok Profile or Video URL:
          <input
            type="text"
            value={targetUrl}
            onChange={(e) => setTargetUrl(e.target.value)}
            placeholder="Paste your TikTok URL here"
            required
          />
        </label>
        <label>
          Amount of {type === 'FOLLOW' ? 'Followers' : 'Likes'}:
          <input
            type="number"
            value={totalAmount}
            onChange={(e) => setTotalAmount(e.target.value)}
            min="5"
            required
          />
        </label>

        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating...' : `Create Campaign (Cost: ${totalAmount * (type === 'FOLLOW' ? 20 : 4)} Stars)`}
        </button>
      </form>
    </div>
  );
}

export default CampaignsPage;