/**
 * @copyright 2025 Mihai Elisei
 * @license Apache-2.0
 */

import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import {
  ACCESS_TOKEN,
  GOOGLE_ACCESS_TOKEN,
  REFRESH_TOKEN,
} from "../constants/token";
import api from "./api";

export const useAuthentication = () => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN);
      const googleAccessToken = localStorage.getItem(GOOGLE_ACCESS_TOKEN);

      // Handle normal access token
      if (token) {
        try {
          const decodedToken = jwtDecode(token);
          const tokenExpiration = decodedToken.exp;
          const now = Date.now() / 1000;

          if (tokenExpiration < now) {
            await refreshToken();
          } else {
            setIsAuthorized(true);
            setUser(decodedToken);
          }
        } catch (error) {
          console.error("Error decoding ACCESS_TOKEN:", error);
          setIsAuthorized(false);
          setUser(null);
        }
      }

      if (googleAccessToken) {
        try {
          const decodedGoogleToken = jwtDecode(googleAccessToken);
          const googleTokenExpiration = decodedGoogleToken.exp;
          const now = Date.now() / 1000;

          if (googleTokenExpiration < now) {
            logout();
          } else {
            const { isValid, user } = await validateGoogleToken(
              googleAccessToken
            );
            if (isValid) {
              setIsAuthorized(true);
              setUser(user);
            } else {
              localStorage.removeItem(GOOGLE_ACCESS_TOKEN);
              localStorage.removeItem(ACCESS_TOKEN);
              localStorage.removeItem(REFRESH_TOKEN);
              window.location.reload();
            }
          }
        } catch (error) {
          console.error("Error decoding GOOGLE_ACCESS_TOKEN:", error);
          logout();
        }
      }

      if (!token && !googleAccessToken) {
        setIsAuthorized(false);
        setUser(null);
      }

      setLoading(false);
    };

    auth().catch(() => {
      setIsAuthorized(false);
      setLoading(false);
      setUser(null);
    });
  }, []);

  const refreshToken = async () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    try {
      const res = await api.post("/token/refresh/", {
        refresh: refreshToken,
      });
      if (res.status === 200) {
        const newAccessToken = res.data.access;
        localStorage.setItem(ACCESS_TOKEN, newAccessToken);

        const newDecodedToken = jwtDecode(newAccessToken);
        setUser(newDecodedToken);
        setIsAuthorized(true);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Error refreshing token", error);
      logout();
    }
  };

  /**
   * Sends a request to validate the provided Google authentication token.
   * @param {string} googleAccessToken - The Google access token to validate.
   * @returns {Promise<{ isValid: boolean, isSuperuser: boolean, user: object | null }>} - Returns token validity and superuser status.
   */
  const validateGoogleToken = async (googleAccessToken) => {
    try {
      const res = await api.post(
        "/google/validate_token/",
        {
          access_token: googleAccessToken,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.valid) {
        try {
          const decodedGoogleToken = jwtDecode(googleAccessToken);
          return {
            isValid: true,
            isSuperuser: decodedGoogleToken.is_superuser || false,
            user: decodedGoogleToken,
          };
        } catch (error) {
          console.error("Error decoding GOOGLE_ACCESS_TOKEN:", error);
          return { isValid: false, isSuperuser: false, user: null };
        }
      }
      return { isValid: false, isSuperuser: false, user: null };
    } catch (error) {
      console.error("Error validating token:", error);
      return { isValid: false, isSuperuser: false, user: null };
    }
  };

  /**
   * Logs the user out by removing authentication tokens from local storage
   * and updating the authorization state to false.
   */
  const logout = () => {
    localStorage.removeItem(ACCESS_TOKEN);
    localStorage.removeItem(GOOGLE_ACCESS_TOKEN);
    localStorage.removeItem(REFRESH_TOKEN);
    setIsAuthorized(false);
    setUser(null);
    window.location.reload();
  };

  return { isAuthorized, loading, user, logout };
};

export default useAuthentication;
