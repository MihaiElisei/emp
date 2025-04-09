/**
 * @copyright 2025 Mihai Elisei
 * @license Apache-2.0
 */

import axios from "axios";
import {
  ACCESS_TOKEN,
  GOOGLE_ACCESS_TOKEN,
  REFRESH_TOKEN,
} from "../constants/token.js";
import { jwtDecode } from "jwt-decode";

export const apiUrl = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: apiUrl,
});

api.interceptors.request.use(async (config) => {
  try {
    let accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (accessToken) {
      const decodedToken = jwtDecode(accessToken);
      if (decodedToken.exp < Date.now() / 1000) {
        const success = await refreshToken();
        if (!success) return Promise.reject(new Error("Session expired"));
        accessToken = localStorage.getItem(ACCESS_TOKEN);
      }
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    const googleAccessToken = localStorage.getItem(GOOGLE_ACCESS_TOKEN);
    if (googleAccessToken) {
      config.headers["X-Google-Access-Token"] = googleAccessToken;
    }
  } catch (err) {
    console.error("Error setting request headers:", err);
  }
  return config;
});

const refreshToken = async () => {
  const refresh = localStorage.getItem(REFRESH_TOKEN);
  if (!refresh) return false;
  try {
    const { data } = await axios.post(`${apiUrl}/token/refresh/`, { refresh });
    localStorage.setItem(ACCESS_TOKEN, data.access);
    return true;
  } catch (error) {
    console.error("Token refresh failed:", error);
    return false;
  }
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;
