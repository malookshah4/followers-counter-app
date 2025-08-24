import { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Corrected import
import axios from 'axios';
import { useDispatch } from 'react-redux';
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
            const response = await axios.get(`http://localhost:8080/api/v1/auth/tiktok/callback?code=${code}`);
            
            const { token, user } = response.data;
            
            localStorage.setItem('authToken', token);
            dispatch(setLogin(user));
            navigate('/live-counter');

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