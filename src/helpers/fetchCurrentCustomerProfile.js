import { axiosInstance, endpoints } from "@/helpers/axiosHelper";

export async function fetchCurrentCustomerProfile() {
  try {
    const response = await axiosInstance.get(endpoints.customerProfile);
    console.log("Current Customer Profile:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching current customer profile:", error);
    throw error; // Rethrow the error so it can be handled by the caller
  }
}
