const BASE_URL = import.meta.env.VITE_API_URL || "https://sigmagpt-backend-xvgs.onrender.com";

export const API_ENDPOINTS = {
  AUTH: `${BASE_URL}/api/auth`,
  CHAT: `${BASE_URL}/api/chat`,
  THREAD: `${BASE_URL}/api/thread`
};

export const defaultHeaders = {
  "Content-Type": "application/json",
  "X-Requested-With": "XMLHttpRequest"
};

