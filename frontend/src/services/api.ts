import axios from "axios";
import {
  Reservation,
  AvailabilityRequest,
  BookingRequest,
  AvailabilityResponse,
} from "../types";

const API_BASE_URL = "http://localhost:5001/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const checkAvailability = async (
  request: AvailabilityRequest
): Promise<AvailabilityResponse> => {
  console.log("Sending checkAvailability request:", request);
  try {
    const response = await api.post<AvailabilityResponse>(
      "/test-drive/check-availability",
      request
    );
    console.log("Received checkAvailability response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in checkAvailability:", error);
    throw error;
  }
};

export const scheduleTestDrive = async (
  request: BookingRequest
): Promise<Reservation> => {
  console.log("Sending scheduleTestDrive request:", request);
  try {
    const response = await api.post<Reservation>(
      "/test-drive/schedule-test-drive",
      request
    );
    console.log("Received scheduleTestDrive response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error in scheduleTestDrive:", error);
    throw error;
  }
};
