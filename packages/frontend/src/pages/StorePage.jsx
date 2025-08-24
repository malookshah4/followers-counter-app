import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import apiClient from '../services/api';
import { updateStars } from '../features/user/userSlice';

// A reusable component for a single star pack
const StarPackCard = ({ pack, onPurchase, isLoading }) => {
  return (
    <div style={{ border: '1px solid #555', padding: '20px', width: '200px', textAlign: 'center' }}>
      <h3>{pack.name}</h3>
      <p style={{ fontSize: '2em', margin: '10px 0' }}>✨ {pack.stars.toLocaleString()}</p>
      <button onClick={() => onPurchase(pack.id)} disabled={isLoading}>
        {isLoading ? 'Purchasing...' : `Buy for ${pack.price}`}
      </button>
    </div>
  );
};

function StorePage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const packs = [
    { id: 'starter', name: 'Starter Pack', stars: 550, price: '$5.99' },
    { id: 'creator', name: 'Creator Pack', stars: 1200, price: '$11.99' },
    { id: 'pro', name: 'Pro Pack', stars: 3000, price: '$24.99' },
  ];

  const handlePurchase = async (packId) => {
    setIsLoading(true);
    setError('');
    try {
      // Call our new developer endpoint
      const response = await apiClient.post('/store/purchase-pack-dev', { packId });

      // Update the star balance in Redux
      dispatch(updateStars(response.data.newStarBalance));

      // Redirect to a success page
      navigate('/order/success');

    } catch (err) {
      setError('Could not complete purchase. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <button onClick={() => navigate('/dashboard')} style={{ marginBottom: '20px' }}>
        Back to Dashboard
      </button>
      <h1>Star Store</h1>
      <p>Run out of stars? Purchase a pack below to continue creating campaigns.</p>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '30px' }}>
        {packs.map(pack => (
          <StarPackCard key={pack.id} pack={pack} onPurchase={handlePurchase} isLoading={isLoading} />
        ))}
      </div>

      {error && <p style={{ color: 'red', marginTop: '20px' }}>{error}</p>}
    </div>
  );
}

export default StorePage;