import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5057", // or your production URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token"); // or use your auth context / cookie
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 → auto logout (optional but very common)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // logout user, redirect to login, clear token...
      localStorage.removeItem("access_token");
      window.location.href = "/auth?mode=login&session_expired=true";
    }
    return Promise.reject(error);
  }
);

export default api;