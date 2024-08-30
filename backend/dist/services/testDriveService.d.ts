import { IVehicle, IReservation } from "../types";
export declare const checkAvailability: (location: string, vehicleType: string, startDateTime: Date, durationMins: number) => Promise<IVehicle | null>;
export declare const scheduleTestDrive: (vehicleId: string, startDateTime: Date, durationMins: number, customerName: string, customerEmail: string, customerPhone: string) => Promise<IReservation>;
