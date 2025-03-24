import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;

const options = {
  baseURL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};
const Api = axios.create(options);

// Add request interceptor to include token in requests if available
Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

Api.interceptors.response.use(
  (response) => {
    // Store token if present in response
    if (response.data?.token) {
      localStorage.setItem("authToken", response.data.token);
    }

    if (response.data && response.data.status === "fail") {
      return Promise.reject({
        message: response.data.message || "Operation failed",
        status: response.status,
        ...response.data,
      });
    }
    return response.data;
  },
  (error) => {
    const { status, data } = error.response || { status: 500, data: {} };

    // Handle unauthorized errors (token expired/invalid)
    if (status === 401) {
      localStorage.removeItem("authToken");
      // Optional: Redirect to login page
      // window.location.href = '/login';
    }

    return Promise.reject({
      message: data.message || "An error occurred",
      status,
      ...data,
    });
  }
);
export default Api;
