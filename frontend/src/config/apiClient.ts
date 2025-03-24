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
console.log("Api", options);

Api.interceptors.response.use(
  (response) => {
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
    return Promise.reject({
      message: data.message || "An error occurred",
      status,
      ...data,
    });
  }
);
export default Api;
