import { Vehicle } from "../models/Vehicle";
import { Reservation } from "../models/Reservation";
import { IVehicle, IReservation } from "../types";

export const VehicleRepository = {
  findVehicles: async (location: string, vehicleType: string): Promise<IVehicle[]> => {
    return Vehicle.find({ location, type: vehicleType });
  },

  findVehicleById: async (vehicleId: string): Promise<IVehicle | null> => {
    return Vehicle.findOne({ id: vehicleId });
  },

  findConflictingReservations: async (
    vehicleId: string,
    startDateTime: Date,
    endDateTime: Date
  ): Promise<IReservation[]> => {
    return Reservation.find({
      vehicleId,
      $or: [
        {
          startDateTime: { $lt: endDateTime },
          endDateTime: { $gt: startDateTime },
        },
        { startDateTime: { $gte: startDateTime, $lt: endDateTime } },
      ],
    });
  },

  findNearbyReservations: async (
    vehicleId: string,
    bufferStartTime: Date,
    bufferEndTime: Date,
    startDateTime: Date,
    endDateTime: Date
  ): Promise<IReservation[]> => {
    return Reservation.find({
      vehicleId,
      $or: [
        { endDateTime: { $gt: bufferStartTime, $lte: startDateTime } },
        { startDateTime: { $gte: endDateTime, $lt: bufferEndTime } },
      ],
    });
  },

  createReservation: async (reservationData: Omit<IReservation, 'id'>): Promise<IReservation> => {
    const newReservation = new Reservation({
      id: Date.now(),
      ...reservationData,
    });
    await newReservation.save();
    return newReservation;
  },
};
