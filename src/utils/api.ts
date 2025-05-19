import axios from "axios";

const potentesApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Add a request interceptor to include the auth token
potentesApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("potentes-access-token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle authentication errors
potentesApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear localStorage and redirect to login on auth errors
      localStorage.removeItem("potentes-access-token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export { potentesApi };
