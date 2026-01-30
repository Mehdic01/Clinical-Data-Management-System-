import axios from "axios";

// Axios instance with interceptors for API communication
// Centralizes all HTTP configuration and error handling

export type ApiError = {
  message: string;
  status?: number;
  fieldErrors?: Record<string, string>;
};

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor (can add auth tokens here later)
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    // const token = localStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Global error handling can be added here
    return Promise.reject(error);
  }
);

export function toApiError(err: unknown): ApiError {
  if (!axios.isAxiosError(err)) return { message: "Unknown error" };

  const status = err.response?.status;
  const data: any = err.response?.data;

  // FastAPI often returns: { detail: "..." } or { detail: [{loc, msg, type}] }
  if (typeof data?.detail === "string") {
    return { message: data.detail, status };
  }

  if (Array.isArray(data?.detail)) {
    // validation errors
    const fieldErrors: Record<string, string> = {};
    for (const e of data.detail) {
      const field = Array.isArray(e.loc) ? e.loc[e.loc.length - 1] : "field";
      fieldErrors[String(field)] = e.msg ?? "Invalid";
    }
    return { message: "Validation error", status, fieldErrors };
  }

  return { message: err.message || "Request failed", status };
}
