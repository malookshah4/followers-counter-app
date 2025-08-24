

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import apiClient from '../services/api';
import { updateStars } from '../features/user/userSlice';

function CreateCampaignDialog({ offer, onClose, onCampaignCreated }) {
    const dispatch = useDispatch();
    const [targetUrl, setTargetUrl] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // We use the data from the 'offer' prop to create the campaign
            await apiClient.post('/campaigns', {
                type: offer.type,
                targetUrl: targetUrl,
                totalAmount: offer.amount,
            });

            // After success, fetch the user's new star balance
            const userResponse = await apiClient.get('/user/me');
            dispatch(updateStars(userResponse.data.user.stars));
            
            alert('Campaign created successfully!');
            onCampaignCreated(); // This function (passed as a prop) will refresh the dashboard data

        } catch (err) {
            setError(err.response?.data?.message || 'An unexpected error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="dialog-backdrop">
            <div className="dialog-content">
                <h2>Activate Campaign</h2>
                <p>You are activating the "Get {offer.amount} {offer.type}s" offer.</p>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="targetUrl">Your TikTok Profile or Video URL:</label>
                    <input
                        id="targetUrl"
                        type="text"
                        value={targetUrl}
                        onChange={(e) => setTargetUrl(e.target.value)}
                        placeholder="Paste your TikTok URL here"
                        required
                    />
                    {error && <p className="error-text">{error}</p>}
                    <div className="dialog-actions">
                        <button type="button" className="button-secondary" onClick={onClose}>Cancel</button>
                        <button type="submit" className="button-primary" disabled={isLoading}>
                            {isLoading ? 'Activating...' : `Activate for ✨${offer.cost} Stars`}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateCampaignDialog;