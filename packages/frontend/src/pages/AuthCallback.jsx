// packages/frontend/src/pages/AuthCallback.jsx

import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import apiClient from '../services/api'; // Use our configured apiClient
import { setLogin } from '../features/user/userSlice';

function AuthCallback() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!hasRun.current) {
      hasRun.current = true;

      const finalizeAuth = async () => {
        const params = new URLSearchParams(location.search);
        const code = params.get('code');

        if (code) {
          try {
            // This now uses the apiClient, which has the correct live backend URL
            const response = await apiClient.get(`/auth/tiktok/callback?code=${code}`);

            const { token, user } = response.data;

            localStorage.setItem('authToken', token);
            dispatch(setLogin(user));
            navigate('/dashboard');

          } catch (error) {
            console.error('Failed to finalize authentication', error);
            navigate('/');
          }
        } else {
          navigate('/');
        }
      };

      finalizeAuth();
    }
  }, [location, navigate, dispatch]);

  return <div>Finalizing authentication, please wait...</div>;
}

export default AuthCallback;