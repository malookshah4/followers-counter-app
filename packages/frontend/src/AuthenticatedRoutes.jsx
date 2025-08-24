// packages/frontend/src/AuthenticatedRoutes.jsx

import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
// We'll need a way to refresh the campaign list later
// import { refreshCampaigns } from './features/campaigns/campaignsSlice';

function AuthenticatedRoutes() {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (!token) {
            navigate('/');
            return;
        }

        // Ask for permission to show notifications
        if (Notification.permission !== 'granted') {
            Notification.requestPermission();
        }

        // The WebSocket URL is now simple because of the proxy we set up
        const wsProtocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const wsUrl = `${wsProtocol}://${window.location.host}`;

        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log('WebSocket connected!');
            ws.send(JSON.stringify({ type: 'AUTH', token: token }));
        };

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log('Message from server:', data);

            if (data.type === 'CAMPAIGN_PROGRESS') {
                // Show a browser notification
                if (Notification.permission === 'granted') {
                    new Notification('Campaign Progress!', {
                        body: data.message,
                    });
                } else {
                    alert(data.message); // Fallback for when notifications are denied
                }
                // Later, we will dispatch an action here to auto-refresh the UI
                // dispatch(refreshCampaigns());
            }
        };

        ws.onclose = () => {
            console.log('WebSocket disconnected.');
        };

        // Clean up the connection when the user navigates away
        return () => {
            ws.close();
        };
    }, [navigate, dispatch]);

    // The <Outlet /> component renders the actual page (e.g., Dashboard, Store)
    return <Outlet />;
}

export default AuthenticatedRoutes;