// API configuration
export const API_CONFIG = {
  BASE_URL: "https://befull.akbarryyan.web.id/api",
  TIMEOUT: 10000,
  HEADERS: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
};

// API endpoints
export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/login",
    LOGOUT: "/logout",
  },
  DIVISIONS: "/divisions",
  EMPLOYEES: "/employees",
};
