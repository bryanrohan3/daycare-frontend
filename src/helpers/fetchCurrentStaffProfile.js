// src/helpers/profileHelper.js
import { axiosInstance, endpoints } from "@/helpers/axiosHelper";

export async function fetchCurrentStaffProfile() {
  try {
    const response = await axiosInstance.get(endpoints.currentStaffProfile);
    console.log("Current Staff Profile:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching current staff profile:", error);
    throw error; // Rethrow the error so it can be handled by the caller
  }
}
