import axios from 'axios';
import { getStoreState } from './app/store';
import { refreshAccessToken } from './features/auth/authSlice';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/',
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = getStoreState().auth.user?.token;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401 && !error.config._retry) {
      error.config._retry = true;
      try {
        const refreshSucceeded = await getStoreState().dispatch(refreshAccessToken());
        if (refreshSucceeded) {
          const newAccessToken = getStoreState().auth.user?.accessToken;
          if (newAccessToken) {
            error.config.headers.Authorization = `Bearer ${newAccessToken}`;
          }
          return apiClient(error.config); // retry the request with new access token
        } 
      } catch (refreshError) {
        return Promise.reject(new Error('Session expired. Please login again.'));
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
