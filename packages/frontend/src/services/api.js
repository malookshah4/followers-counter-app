import axios from 'axios';

const apiClient = axios.create({
   baseURL: `${import.meta.env.VITE_API_BASE_URL}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// THIS IS THE CRUCIAL PART
// It "intercepts" every request before it is sent.
apiClient.interceptors.request.use(
  (config) => {
    // It gets the token from local storage.
    const token = localStorage.getItem('authToken');

    // If the token exists, it adds the 'Authorization' header.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // It then sends the request with the new header.
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;