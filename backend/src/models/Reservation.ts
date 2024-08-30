import mongoose from 'mongoose';
import { IReservation } from '../types';

const ReservationSchema = new mongoose.Schema<IReservation>({
  id: { type: Number, required: true, unique: true },
  vehicleId: { type: String, required: true },
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date, required: true },
  customerName: { type: String, required: true },
  customerEmail: { type: String, required: true },
  customerPhone: { type: String, required: true },
});


export const Reservation = mongoose.model<IReservation>('Reservation', ReservationSchema);
