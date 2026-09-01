import axios from "axios";

const resolveBaseURL = () => {
  const fromEnv = import.meta.env.VITE_API_URL?.trim();
  const isLocalhost = fromEnv && /localhost|127\.0\.0\.1/.test(fromEnv);

  // A leftover localhost value (or a missing env var) would make every
  // production request fail in the browser. Use same-origin `/api`, which
  // Vite proxies locally and Vercel rewrites to Render in production.
  if (import.meta.env.PROD && (!fromEnv || isLocalhost)) {
    return "/api";
  }

  return (fromEnv || "http://localhost:5000/api").replace(/\/$/, "");
};

const api = axios.create({
  baseURL: resolveBaseURL(),
  withCredentials: true, // send the httpOnly auth cookie with every request
  headers: { "Content-Type": "application/json" },
});

// Normalize error messages so components can just read err.message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message || error.message || "Something went wrong";
    return Promise.reject(new Error(message));
  }
);

export default api;
