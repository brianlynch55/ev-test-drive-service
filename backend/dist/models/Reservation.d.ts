import mongoose from 'mongoose';
import { IReservation } from '../types';
export declare const Reservation: mongoose.Model<IReservation, {}, {}, {}, mongoose.Document<unknown, {}, IReservation> & IReservation & {
    _id: mongoose.Types.ObjectId;
}, any>;
