import mongoose from 'mongoose';
import { IVehicle } from '../types';

const VehicleSchema = new mongoose.Schema<IVehicle>({
  id: { type: String, required: true, unique: true },
  type: { type: String, required: true },
  location: { type: String, required: true },
  availableFromTime: { type: String, required: true },
  availableToTime: { type: String, required: true },
  availableDays: { type: [String], required: true },
  minimumMinutesBetweenBookings: { type: Number, required: true },
});

export const Vehicle = mongoose.model<IVehicle>('Vehicle', VehicleSchema);
