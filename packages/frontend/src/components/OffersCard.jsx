import React, { useState } from 'react';
import CreateCampaignDialog from './CreateCampaignDialog.jsx'; 

const availableOffers = [
    { id: 'offer1', type: 'FOLLOW', amount: 5, cost: 5 },
    { id: 'offer2', type: 'LIKE', amount: 10, cost: 10 },
];

function OffersCard({ onCampaignCreated }) {
    const [selectedOffer, setSelectedOffer] = useState(null);

    return (
        <>
            <div className="card">
                <h3 className="card-header">Available Offers</h3>
                <ul className="offer-list">
                    {availableOffers.map(offer => (
                        <li key={offer.id} className="offer-item">
                            <div className="offer-details">
                                <span className="offer-main-text">Get {offer.amount} {offer.type === 'FOLLOW' ? 'Followers' : 'Likes'}</span>
                                <span className="offer-cost-text">for ✨{offer.cost} Stars</span>
                            </div>
                            <button className="offer-button" onClick={() => setSelectedOffer(offer)}>
                                Activate
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            {/* The Dialog will only render when an offer is selected */}
            {selectedOffer && (
                <CreateCampaignDialog 
                    offer={selectedOffer} 
                    onClose={() => setSelectedOffer(null)}
                    onCampaignCreated={() => {
                        onCampaignCreated(); // Refresh the dashboard
                        setSelectedOffer(null); // Close the dialog
                    }}
                />
            )}
        </>
    );
}

export default OffersCard;