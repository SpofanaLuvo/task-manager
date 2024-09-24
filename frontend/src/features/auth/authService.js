import axios from "axios";
import apiClient from "../../apiClient";

const API_URL = "http://localhost:3001/api/users/";

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}register`, userData);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await apiClient.post(`${API_URL}login`, userData);
  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }
  return response.data;
};

// Refresh access token
const refreshAccessToken = async () => {
  const response = await apiClient.post(`${API_URL}refresh-token`); 
  console.log("TRIGGER REFRESHHHHHHHH")
  console.log(response.data);

  if (response.data) { 
    const user = JSON.parse(localStorage.getItem("user"));
    user.token = response.data.accessToken; 
    localStorage.setItem("user", JSON.stringify(user));
    return response.data.accessToken; 
  }
  throw new Error('Unable to refresh access token');
};

// Logout user
const logout = () => {
  localStorage.removeItem("user");
};

const authService = {
  register,
  logout,
  login,
  refreshAccessToken,
};

export default authService;
