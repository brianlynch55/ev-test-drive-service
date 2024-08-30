import { useState } from "react";
import {
  Vehicle,
  Reservation,
  AvailabilityRequest,
  BookingRequest,
  AvailabilityResponse
} from "../types";
import * as api from "../services/api";

export const useTestDrive = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [availableVehicle, setAvailableVehicle] = useState<Vehicle | null>(
    null
  );
  const [reservation, setReservation] = useState<Reservation | null>(null);

  const checkAvailability = async (
    request: AvailabilityRequest
  ): Promise<AvailabilityResponse> => {
    setReservation(null);
    setLoading(true);
    setError(null);
    try {
      const response = await api.checkAvailability(request);
      if (response.available && response.vehicle) {
        setAvailableVehicle(response.vehicle);
      } else {
        setAvailableVehicle(null);
      }
      setLoading(false);
      return response;
    } catch (err) {
      setError("Failed to check availability. Please try again.");
      setAvailableVehicle(null);
      setLoading(false);
      return {
        available: false,
        reason: "An error occurred while checking availability.",
      };
    }
  };

  const scheduleTestDrive = async (
    request: BookingRequest
  ): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const newReservation = await api.scheduleTestDrive(request);
      setReservation(newReservation);
      setLoading(false);
      return true;
    } catch (err) {
      setError("Failed to schedule test drive. Please try again.");
      setReservation(null);
      setLoading(false);
      return false;
    }
  };

  return {
    loading,
    error,
    availableVehicle,
    reservation,
    checkAvailability,
    scheduleTestDrive,
  };
};
