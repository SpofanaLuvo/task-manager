import axios from "axios";
import useAuthStore from "./store/authStore";

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/', // Use environment var for flexibility
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const accessToken = useAuthStore.getState().accessToken; // Correct way to access the store state outside components
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
    const accessToken = useAuthStore.getState().accessToken;
    if (error.response && error.response.status === 401 && !error.config._retry) {
      error.config._retry = true;
      const refreshSucceeded = await useAuthStore.getState().refreshAccessToken();
      if (refreshSucceeded) {
        const newAccessToken = useAuthStore.getState().accessToken;
        if (newAccessToken) {
          error.config.headers.Authorization = `Bearer ${newAccessToken}`;
        }
        return apiClient(error.config);
      } else {
        return Promise.reject(new Error("Session expired. Please login again."));
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
