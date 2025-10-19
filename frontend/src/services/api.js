import axios from "axios";
import { tokenUtils } from "../utils/tokenUtils";

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

let isRefreshing = false;
let refreshSubscribers = [];

function subscribeTokenRefresh(cb) {
  refreshSubscribers.push(cb);
}

function onRefreshed(newToken) {
  refreshSubscribers.forEach((cb) => cb(newToken));
  refreshSubscribers = [];
}

// Request interceptor to add auth token if available
api.interceptors.request.use(
  (config) => {
    // Respect pre-set Authorization (e.g., admin endpoints). Only set if missing.
    if (!config.headers) config.headers = {};
    if (!config.headers.Authorization) {
      const token = tokenUtils.getAuthToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle 401 and try refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      const isAdminRequest = originalRequest?.url?.includes("/admin/");

      // If this is an admin endpoint, don't run customer refresh flow; route to admin login.
      if (isAdminRequest) {
        try {
          tokenUtils.removeAdminToken?.();
        } catch {}
        // Redirect to admin login page
        if (typeof window !== "undefined") {
          window.location.href = "/admin/login";
        }
        return Promise.reject(error);
      }

      // Avoid infinite loop
      originalRequest._retry = true;

      if (isRefreshing) {
        // Queue the request until refresh completes
        return new Promise((resolve, reject) => {
          subscribeTokenRefresh((newToken) => {
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              resolve(api(originalRequest));
            } else {
              reject(error);
            }
          });
        });
      }

      isRefreshing = true;

      try {
        const refreshToken = tokenUtils.getRefreshToken();
        if (!refreshToken) throw new Error("No refresh token available");

        // Call the backend refresh endpoint
        const resp = await axios.post(
          `${
            import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api"
          }/auth/refresh`,
          { refreshToken },
          { headers: { "Content-Type": "application/json" } }
        );

        const newAccessToken = resp.data?.accessToken || resp.data?.token;
        const newRefreshToken = resp.data?.refreshToken;

        if (newAccessToken) {
          tokenUtils.setAuthToken(newAccessToken);
          if (newRefreshToken) tokenUtils.setRefreshToken(newRefreshToken);
          onRefreshed(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        }

        // If refresh failed, clear tokens and redirect
        tokenUtils.clearAllTokens();
        window.location.href = "/login";
        return Promise.reject(error);
      } catch (refreshError) {
        tokenUtils.clearAllTokens();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
