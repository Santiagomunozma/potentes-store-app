import axios from "axios";

// Función para obtener variables de entorno dinámicamente
const getEnvVar = (key: string, defaultValue?: string): string => {
  // Primero intentar desde window._env_ (variables de entorno en tiempo de ejecución)
  if (typeof window !== "undefined" && (window as any)._env_) {
    const envValue = (window as any)._env_[key];
    if (envValue !== undefined) {
      return envValue;
    }
  }

  // Si no está disponible, usar import.meta.env (variables de entorno en tiempo de construcción)
  return import.meta.env[key] || defaultValue || "";
};

const potentesApi = axios.create({
  baseURL: getEnvVar("VITE_API_URL", "http://localhost:3000/api"),
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
