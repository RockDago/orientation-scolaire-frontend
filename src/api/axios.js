import axios from "axios";
import { getApiErrorMessage, getApiValidationErrors } from "./errors";

export const API_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost/orientation-scolaire-professionnelle/backend/public"
    : "https://dssip.bambaray.mg/backend/public");

const API = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

const PUBLIC_ROUTES = [
  "/track-view",
  "/track-search",
  "/track-etablissement-selection",
  "/top-metiers",
  "/metiers",
  "/mentions",
  "/domaines",
  "/series",
  "/etablissements",
  "/parcours",
];

const isPublicRoute = (url = "") =>
  PUBLIC_ROUTES.some((route) => url.includes(route));

const clearAuthStorage = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userRole");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("userRole");
};

const normalizeAxiosError = (error) => {
  error.status = error.response?.status ?? null;
  error.validationErrors = getApiValidationErrors(error);
  error.apiMessage = getApiErrorMessage(error);
  return error;
};

API.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    const normalizedError = normalizeAxiosError(error);

    if (normalizedError.status === 401) {
      const requestUrl = error.config?.url || "";
      const currentPath = window.location.pathname;

      console.error("[Axios] 401 detecte:", {
        url: requestUrl,
        method: error.config?.method?.toUpperCase(),
        message: normalizedError.apiMessage,
        fullUrl: `${error.config?.baseURL || ""}${requestUrl}`,
      });

      if (currentPath === "/login") {
        return Promise.reject(normalizedError);
      }

      if (isPublicRoute(requestUrl) || currentPath.startsWith("/acceuil")) {
        return Promise.reject(normalizedError);
      }

      clearAuthStorage();
      window.location.href = "/login";
    }

    return Promise.reject(normalizedError);
  },
);

export default API;
