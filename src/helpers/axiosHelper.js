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
  customerSignUp: apiConstants.api_hostname + "customer-profile/",
  createDaycare: apiConstants.api_hostname + "daycare/",
  currentStaffProfile: apiConstants.api_hostname + "staff-profile/current/",
  editDaycare: (daycareId) => `daycare/${daycareId}/`, // PUT request to update daycare by ID
  getDaycareById: (daycareId) => `daycare/${daycareId}/`,
  daycare: apiConstants.api_hostname + "daycare",
  // getProductById: (productId) => `products/${productId}/`, // GET request for a single product
  updateProduct: (productId) => `product/${productId}/`, // PUT request to update a product
  product: apiConstants.api_hostname + "product/",
  addEmployee: apiConstants.api_hostname + "staff-profile/",
  roster: apiConstants.api_hostname + "roster/",
  unavailability: apiConstants.api_hostname + "unavailability/",
  customerProfile: apiConstants.api_hostname + "customer-profile/current/",
  updatePet: (petId) => `pet/${petId}/`,
  createPet: apiConstants.api_hostname + "pet/",
  getPet: (id) => `pet/${id}/`,
};

export { axiosInstance, endpoints };
