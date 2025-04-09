/**
 * @copyright 2025 Mihai Elisei
 * @license Apache-2.0
 */

import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GOOGLE_ACCESS_TOKEN } from "../constants/token";
import { apiUrl } from "./api";

function GoogleRedirectHandler() {
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const accessToken = queryParams.get("access_token");

    if (accessToken) {
      localStorage.setItem(GOOGLE_ACCESS_TOKEN, accessToken);

      axios.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
      axios
        .get(`${apiUrl}/auth/user/`)
        .then(() => {
          navigate("/");
        })
        .catch((error) => {
          console.error(
            "Error verfiying token:",
            error.response ? error.response.data : error.message
          );
          navigate("/login");
        });
    } else {
      console.log("No token found in URL");
      navigate("/login");
    }
  }, [navigate]);

  return <div>Logging In.........</div>;
}

export default GoogleRedirectHandler;
