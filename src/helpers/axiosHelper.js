import axios from "axios";
import store from "@/store";

const hostname = "http://localhost:8000/";

const apiConstants = {
  api_hostname: hostname + "api/",
  hostname: hostname,
};

const axiosInstance = axios.create({
  baseURL: apiConstants.api_hostname, // Your API base URL
});

let tokenType = "Token";

// Add a request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = store.getters.getAuthToken; // Get the token from your Vuex store
    if (token) {
      config.headers["Authorization"] = `${tokenType} ${token}`; // Set the token in the Authorization header
    } else {
      console.warn("No auth token found");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error); // Pass the error to the next interceptor
  }
);

const endpoints = {
  login: apiConstants.api_hostname + "users/login/",
};

export { axiosInstance, endpoints };
