import axios from 'axios';

// --- API Configuration ---
const API_URL = 'http://localhost:5000/api'; // Your backend URL
const api = axios.create({ baseURL: API_URL });

// Function to set the auth token for all subsequent API requests
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete api.defaults.headers.common['x-auth-token'];
  }
};

export default api;

