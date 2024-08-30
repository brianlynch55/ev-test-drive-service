import mongoose from 'mongoose';
import { IVehicle } from '../types';
export declare const Vehicle: mongoose.Model<IVehicle, {}, {}, {}, mongoose.Document<unknown, {}, IVehicle> & IVehicle & {
    _id: mongoose.Types.ObjectId;
}, any>;
