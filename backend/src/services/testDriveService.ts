import { VehicleRepository } from "../repository/vehicleRepository";
import { IVehicle, IReservation } from "../types";
import { isTimeWithinRange } from "../utils/dateUtils";
import { format, addMinutes, subMinutes } from "date-fns";

type AvailabilityResult =
  | { available: true; vehicle: IVehicle }
  | { available: false; reason: string };

type AvailabilityCheck = (
  vehicle: IVehicle,
  startDateTime: Date,
  durationMins: number
) => Promise<AvailabilityResult>;

const checkDayAvailability = (
  vehicle: IVehicle,
  startDateTime: Date
): boolean =>
  vehicle.availableDays.includes(format(startDateTime, "EEE").toLowerCase());

const checkTimeAvailability = (
  vehicle: IVehicle,
  startDateTime: Date
): boolean =>
  isTimeWithinRange(
    startDateTime,
    vehicle.availableFromTime,
    vehicle.availableToTime
  );

const checkReservationConflict = async (
  vehicle: IVehicle,
  startDateTime: Date,
  durationMins: number
): Promise<boolean> => {
  const endDateTime = addMinutes(startDateTime, durationMins);
  const reservations = await VehicleRepository.findConflictingReservations(
    vehicle.id,
    startDateTime,
    endDateTime
  );
  console.log(reservations);
  return reservations.length === 0;
};

const checkMinimumTimeBetweenBookings = async (
  vehicle: IVehicle,
  startDateTime: Date,
  durationMins: number
): Promise<boolean> => {
  const endDateTime = addMinutes(startDateTime, durationMins);
  const bufferStartTime = subMinutes(
    startDateTime,
    vehicle.minimumMinutesBetweenBookings
  );
  const bufferEndTime = addMinutes(
    endDateTime,
    vehicle.minimumMinutesBetweenBookings
  );

  const conflictingReservations =
    await VehicleRepository.findNearbyReservations(
      vehicle.id,
      bufferStartTime,
      bufferEndTime,
      startDateTime,
      endDateTime
    );

  return conflictingReservations.length === 0;
};

const isVehicleAvailable: AvailabilityCheck = async (
  vehicle,
  startDateTime,
  durationMins
) => {
  if (!checkDayAvailability(vehicle, startDateTime)) {
    return {
      available: false,
      reason: "The vehicle is not available on this day of the week.",
    };
  }
  if (!checkTimeAvailability(vehicle, startDateTime)) {
    return {
      available: false,
      reason: "The requested time is outside of the vehicle's available hours.",
    };
  }
  if (!(await checkReservationConflict(vehicle, startDateTime, durationMins))) {
    return {
      available: false,
      reason: "The vehicle is already booked for this time slot.",
    };
  }
  if (
    !(await checkMinimumTimeBetweenBookings(
      vehicle,
      startDateTime,
      durationMins
    ))
  ) {
    return {
      available: false,
      reason: `The requested time is too close to another booking. Please allow at least ${vehicle.minimumMinutesBetweenBookings} minutes between bookings.`,
    };
  }
  return { available: true, vehicle };
};

export const checkAvailability = async (
  location: string,
  vehicleType: string,
  startDateTime: Date,
  durationMins: number
): Promise<AvailabilityResult> => {
  const vehicles = await VehicleRepository.findVehicles(location, vehicleType);

  if (vehicles.length === 0) {
    return {
      available: false,
      reason:
        "No vehicles of this type are available at the specified location.",
    };
  }

  const availabilityResults = await Promise.all(
    vehicles.map((vehicle) =>
      isVehicleAvailable(vehicle, startDateTime, durationMins)
    )
  );

  const availableVehicle = availabilityResults.find(
    (result) => result.available
  );
  if (availableVehicle) {
    return availableVehicle;
  }

  const reasons = availabilityResults.map((result) =>
    result.available ? null : result.reason
  );
  const uniqueReasons = [...new Set(reasons.filter(Boolean))];

  if (uniqueReasons.length === 1) {
    return { available: false, reason: uniqueReasons[0] as string };
  }

  return {
    available: false,
    reason:
      "No vehicles of this type are available at the specified location and time.",
  };
};

export const scheduleTestDrive = async (
  vehicleId: string,
  startDateTime: Date,
  durationMins: number,
  customerName: string,
  customerEmail: string,
  customerPhone: string
): Promise<IReservation> => {
  const vehicle = await VehicleRepository.findVehicleById(vehicleId);
  if (!vehicle) {
    throw new Error("Vehicle not found");
  }

  const availabilityResult = await isVehicleAvailable(
    vehicle,
    startDateTime,
    durationMins
  );
  if (!availabilityResult.available) {
    throw new Error(availabilityResult.reason);
  }

  const endDateTime = addMinutes(startDateTime, durationMins);
  return VehicleRepository.createReservation({
    vehicleId,
    startDateTime,
    endDateTime,
    customerName,
    customerEmail,
    customerPhone,
  });
};
